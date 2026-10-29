# 풋볼 카드 (PWA)

선수 카드 · 구단 · 포지션/이적 이력 · 이적료 · 가족 관계.

## 실행
```bash
cd football-app && python3 -m http.server 8000
```
`http://localhost:8000` 접속 후 브라우저 메뉴에서 "앱 설치 / 홈 화면에 추가". 서비스워커(오프라인·설치)는 http(s)에서만 동작합니다.

## 데이터
- `data.js` 선수·구단·가족 / `extra.js` 이적료(`FEES`, 백만 유로 대략치)·위키 문서명(`WIKI`)
- `leagues-data.js` 나라·구단·선수단(4-3-3 순서), `league.js` 만화 그림 생성·리그 화면
- 사진: Wikipedia REST API 썸네일(자동) → API 탭에서 갱신하면 TheSportsDB 사진 우선
- API 탭: TheSportsDB(무료 키 `3`, 분당 30회)로 현재 팀·포지션 갱신, 이름 검색 후 선수 추가(이 기기 localStorage에 저장)
- 사진 저작권은 각 출처(Wikimedia Commons 등) 라이선스를 따릅니다. 배포 시 확인하세요.

코드 수정 후 `sw.js`의 `V` 값을 올리면 설치된 앱이 새 파일을 받습니다.
