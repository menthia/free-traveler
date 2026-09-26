#!/usr/bin/env python3
"""
select_e2e_smoke.py — CI 환경에 실제 Supabase Secret이 있는지에 따라
전체 Playwright Smoke(test:e2e) 또는 공개(로그인 불필요) Smoke(test:e2e:public)만 실행한다.

release:check(package.json)에서 호출된다. Secret이 없는 환경(예: Fork PR CI)에서
Auth가 필요한 Smoke가 실패하는 대신, 처음부터 공개 Smoke만 실행해 의미 없는 실패를 막는다.
"""
from __future__ import annotations

import os
import subprocess
import sys

REQUIRED_SUPABASE_SECRETS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
]


def main() -> int:
    missing = [k for k in REQUIRED_SUPABASE_SECRETS if not os.environ.get(k)]
    if missing:
        print(f"Supabase Secret 누락({', '.join(missing)}) — 공개 Smoke(test:e2e:public)만 실행합니다.")
        npm_script = "test:e2e:public"
    else:
        print("Supabase Secret 확인됨 — 전체 Smoke(test:e2e)를 실행합니다.")
        npm_script = "test:e2e"
    return subprocess.call(["npm", "run", npm_script])


if __name__ == "__main__":
    sys.exit(main())
