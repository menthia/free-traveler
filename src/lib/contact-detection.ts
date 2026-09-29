export type ContactPatternType = "phone" | "email" | "messenger";

export interface ContactMatch {
  type: ContactPatternType;
  match: string;
}

// 010-1234-5678 / 010 1234 5678 / 01012345678 / +82 10-1234-5678
const PHONE_RE = /(?:\+82[-\s]?)?0?1[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/g;

// 일반적인 이메일 형식
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// 카카오톡/카톡/텔레그램/라인/디스코드 ID 언급 패턴(뒤따르는 영숫자/한글 ID 토큰까지 포함).
// "아이디" 뒤에 "는/를/가" 같은 한글 조사가 붙는 자연스러운 문장("카카오톡 아이디는 abc123")도
// 탐지하도록 라벨 뒤 0~3자의 한글 조사를 허용한다.
const MESSENGER_RE =
  /(카카오톡|카톡|텔레그램|라인\s*(?:아이디|id)|디스코드|instagram|인스타(?:그램)?|위챗|whats\s*app)\s*(?:(?:아이디|id)[가-힣]{0,3}|:|@)?\s*[:@]?\s*[a-zA-Z0-9._-]{2,30}/gi;

/**
 * 텍스트에서 전화번호·이메일·메신저 ID로 의심되는 패턴을 모두 탐지한다.
 * 동행 모집글·참가 신청 등 이용자가 작성하는 텍스트에 연락처가 그대로 노출되는 것을
 * 막기 위한 서버 측 사전 검사 유틸이다(REQ-FUNC-032).
 */
export function detectContactPatterns(text: string): ContactMatch[] {
  const matches: ContactMatch[] = [];

  for (const m of text.matchAll(PHONE_RE)) {
    matches.push({ type: "phone", match: m[0] });
  }
  for (const m of text.matchAll(EMAIL_RE)) {
    matches.push({ type: "email", match: m[0] });
  }
  for (const m of text.matchAll(MESSENGER_RE)) {
    matches.push({ type: "messenger", match: m[0] });
  }

  return matches;
}

/** 연락처로 의심되는 패턴이 하나라도 있으면 true. */
export function containsContactPattern(text: string): boolean {
  return detectContactPatterns(text).length > 0;
}
