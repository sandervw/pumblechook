"""Astro component checks for the simple-code rules."""

import re
from pathlib import Path

from rules import CORE_FOLDER_NAMES, MAX_COMMENT_WORDS, Finding, Severity, check_file_length
from typescript_rules import check_comment_length, check_jsdoc_presence, line_at

ASTRO_SUFFIXES = {".astro"}
FRONTMATTER_PATTERN = re.compile(r"\A---\r?\n(.*?)^---[ \t]*$", re.DOTALL | re.MULTILINE)
EMBEDDED_PATTERN = re.compile(r"<(script|style)\b[^>]*>(.*?)</\1>", re.DOTALL)
MARKUP_COMMENT_PATTERN = re.compile(r"<!--(.*?)-->", re.DOTALL)
NOT_A_LINE_BREAK = re.compile(r"[^\n]")


def keep_only(source: str, spans: list[tuple[int, int]]) -> str:
    """Blank all text outside the spans, keeping every line break."""
    pieces = []
    cursor = 0
    for start, end in spans:
        pieces.append(NOT_A_LINE_BREAK.sub(" ", source[cursor:start]))
        pieces.append(source[start:end])
        cursor = end
    pieces.append(NOT_A_LINE_BREAK.sub(" ", source[cursor:]))
    return "".join(pieces)


def check_markup_comments(path: str, source: str) -> list[Finding]:
    """Fail any markup comment longer than the word limit."""
    findings = []
    for match in MARKUP_COMMENT_PATTERN.finditer(source):
        word_count = len(match.group(1).split())
        if word_count > MAX_COMMENT_WORDS:
            message = f"comment has {word_count} words; limit is {MAX_COMMENT_WORDS}"
            findings.append(Finding(path, line_at(source, match.start()), "comment-length", message, Severity.FAIL))
    return findings


def check_core_purity(path: str) -> list[Finding]:
    """Fail any component inside a core folder."""
    if not CORE_FOLDER_NAMES & set(Path(path).parts):
        return []
    message = "core code holds no components; move this to the shell"
    return [Finding(path, 1, "core-purity", message, Severity.FAIL)]


def check_astro(path: str, source: str) -> list[Finding]:
    """Run every Astro check except ESLint on one file's source."""
    frontmatter = FRONTMATTER_PATTERN.match(source)
    frontmatter_spans = [frontmatter.span(1)] if frontmatter else []
    markup_start = frontmatter.end() if frontmatter else 0
    embedded_spans = [match.span(2) for match in EMBEDDED_PATTERN.finditer(source, markup_start)]
    findings = check_core_purity(path)
    findings += check_comment_length(path, keep_only(source, frontmatter_spans + embedded_spans))
    findings += check_jsdoc_presence(path, keep_only(source, frontmatter_spans))
    findings += check_markup_comments(path, source)
    return findings + check_file_length(path, source)
