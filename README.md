# DANCEFLOW APDC Live Test

실제 APDC 데이터를 넣은 DANCEFLOW 테스트 버전입니다.

- Admin password: 0808
- APDC SEARCH 기준 엔트리 770 records
- 최신 APDC timetable: 11:30 start / QF 1:00 / SF 1:10 / Final 1:15 / Break 10 min
- APDC judges seeded
- search.html / judge.html / mc.html / live.html share the same browser data

주의: 현재는 GitHub Pages + localStorage 기반이므로 동일 브라우저 내에서 데이터가 공유됩니다. 실제 여러 기기 동기화는 서버 DB 단계에서 구현해야 합니다.


## V4 APDC seed fix
- Uses a new localStorage key: danceflow_db_apdc_v4
- Old sample data is ignored.
- APDC is loaded as the default competition on first open.
- search/judge/mc/live also load the APDC seed directly.
