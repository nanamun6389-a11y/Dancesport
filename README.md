# DANCEFLOW Competition Platform — Prototype

정적 웹 기반 1차 프로토타입입니다.

## 포함 기능
- 여러 대회 생성/선택
- 대회명, 일정, 장소, 주최자, 로고 설정
- 엔트리 CRUD + CSV import/export
- 심사위원 CRUD
- 타임테이블 CRUD + 순서 이동 + EVENT 자동 재번호 + 시간 재계산
- Public Entry Search
- Judge / MC / LIVE 기본 화면
- AI Promo Studio 구조 + 브라우저 포스터 PNG 생성
- JSON 백업/복원

## 데이터 저장
현재 프로토타입은 브라우저 localStorage를 사용합니다.
실제 사업용 서비스 전환 시 PostgreSQL/Supabase/Firebase 등의 서버 DB로 교체해야 합니다.

## AI 이미지 생성
프로토타입은 즉시 사용 가능한 Canvas 포스터 생성기를 제공합니다.
실제 생성형 AI 이미지는 API 키 노출 방지를 위해 반드시 서버에서 `/api/generate-promo` 같은 엔드포인트를 통해 연결해야 합니다.

## 실행
index.html을 브라우저에서 열거나 GitHub Pages / Netlify / Vercel 등에 정적 사이트로 배포할 수 있습니다.
