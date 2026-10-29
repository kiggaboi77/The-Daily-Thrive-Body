// 이적료(백만 유로, 대략치·기억 기반이라 확인 필요). 키: 선수id:구단id:입단연도. 0 = 자유이적, 없음 = 미상
const FEES = {
  'ronaldo:manutd:2003':15,'ronaldo:realmadrid:2009':94,'ronaldo:juventus:2018':100,'ronaldo:manutd:2021':15,'ronaldo:alnassr:2023':0,
  'messi:psg:2021':0,'messi:miami:2023':0,
  'mbappe:psg:2017':180,'mbappe:realmadrid:2024':0,
  'haaland:salzburg:2019':5,'haaland:dortmund:2020':20,'haaland:mancity:2022':60,
  'marcus:inter:2023':0,
  'eden:chelsea:2012':40,'eden:realmadrid:2019':100,
  'neymar:barcelona:2013':57,'neymar:psg:2017':222,'neymar:alhilal:2023':90,'neymar:santos:2025':0,
  'debruyne:chelsea:2012':8,'debruyne:wolfsburg:2014':22,'debruyne:mancity:2015':76,'debruyne:napoli:2025':0,
  'salah:chelsea:2014':17,'salah:roma:2015':15,'salah:liverpool:2017':42,
  'vini:realmadrid:2018':45,
  'jude:dortmund:2020':25,'jude:realmadrid:2023':103,
  'modric:spurs:2008':21,'modric:realmadrid:2012':35,'modric:milan:2025':0,
  'son:leverkusen:2013':10,'son:spurs:2015':30,'son:lafc:2025':26,
  'kimminjae:napoli:2022':18,'kimminjae:bayern:2023':50,
  'leekangin:mallorca:2021':0,'leekangin:psg:2023':22
};
// 위키백과 문서 제목 (사진 조회용)
const WIKI = {
  messi:'Lionel_Messi',ronaldo:'Cristiano_Ronaldo',mbappe:'Kylian_Mbappé',haaland:'Erling_Haaland',alfinge:'Alf-Inge_Haaland',
  marcus:'Marcus_Thuram',khephren:'Khéphren_Thuram',lilian:'Lilian_Thuram',eden:'Eden_Hazard',thorgan:'Thorgan_Hazard',
  paolo:'Paolo_Maldini',cesare:'Cesare_Maldini',son:'Son_Heung-min',leekangin:'Lee_Kang-in',kimminjae:'Kim_Min-jae_(footballer,_born_1996)',
  salah:'Mohamed_Salah',vini:'Vinícius_Júnior',jude:'Jude_Bellingham',modric:'Luka_Modrić',neymar:'Neymar',
  debruyne:'Kevin_De_Bruyne',kolo:'Kolo_Touré',yaya:'Yaya_Touré'
};
PLAYERS.forEach(p => {
  p.wiki = WIKI[p.id];
  p.careers.forEach(c => { const f = FEES[`${p.id}:${c.club}:${c.from}`]; if (f !== undefined) c.fee = f; });
});

// 선수 프로파일용 출신지 · 소개 (직접 작성, 간단한 설명)
const BIO = {
  messi:{origin:'아르헨티나 로사리오',intro:'바르셀로나에서 20년 가까이 뛰며 역대 최고로 꼽히는 아르헨티나의 공격수. 2022 월드컵 우승을 이끌었고 발롱도르를 여러 차례 수상했다.'},
  ronaldo:{origin:'포르투갈 마데이라 푼샬',intro:'맨체스터 유나이티드·레알 마드리드·유벤투스 등에서 우승을 쌓은 포르투갈의 스트라이커. 5회 발롱도르 수상자이며 꾸준한 득점력과 철저한 자기관리로 유명하다.'},
  mbappe:{origin:'프랑스 파리 (인근 봉디에서 성장)',intro:'10대 때부터 모나코와 PSG에서 두각을 나타낸 프랑스의 공격수. 폭발적인 스피드가 장점이며 2018 월드컵 우승 멤버다.'},
  haaland:{origin:'영국 잉글랜드 리즈 (노르웨이 브뤼네에서 성장)',intro:'압도적인 피지컬과 골 결정력을 가진 노르웨이 스트라이커. 아버지에 이어 맨체스터 시티에서 뛰며 득점 기록을 갈아치웠다.'},
  alfinge:{origin:'노르웨이 스타방에르',intro:'리즈와 맨체스터 시티 등에서 뛴 전 노르웨이 수비형 미드필더. 엘링 홀란의 아버지다.'},
  marcus:{origin:'이탈리아 파르마 출생 (프랑스 국적)',intro:'릴리앙 튀랑의 아들. 빠르고 힘이 좋은 프랑스 공격수로 인터 밀란에서 활약하고 있다.'},
  khephren:{origin:'이탈리아 출생 (프랑스 국적)',intro:'릴리앙 튀랑의 아들이자 마르퀴스의 동생. 활동량과 볼 운반이 좋은 미드필더로 유벤투스에서 뛰고 있다.'},
  lilian:{origin:'프랑스령 과들루프 푸앵트아피트르',intro:'1998 월드컵 우승 멤버인 프랑스 수비수. 은퇴 후에는 인종차별 반대 활동으로도 알려졌다.'},
  eden:{origin:'벨기에 라 루비에르',intro:'화려한 드리블로 첼시와 레알 마드리드에서 활약한 벨기에 윙어. 2023년 은퇴했다.'},
  thorgan:{origin:'벨기에 라 루비에르',intro:'에덴 아자르의 동생. 묀헨글라트바흐와 도르트문트 등에서 뛴 벨기에 윙어.'},
  paolo:{origin:'이탈리아 밀라노',intro:'평생을 AC 밀란에서 보낸 전설적인 수비수. 아버지 체사레도 밀란에서 뛰었다.'},
  cesare:{origin:'이탈리아 트리에스테',intro:'밀란에서 주장으로 뛴 전 이탈리아 수비수이자 감독. 파올로 말디니의 아버지다.'},
  son:{origin:'대한민국 강원도 춘천',intro:'아버지 손웅정에게 기본기를 배운 한국의 에이스. 토트넘에서 10년을 뛴 뒤 LAFC로 이적했다.'},
  leekangin:{origin:'대한민국 인천',intro:'발렌시아 유스 출신의 왼발 플레이메이커. 마요르카를 거쳐 PSG에서 뛰고 있다.'},
  kimminjae:{origin:'대한민국 경상남도 통영',intro:'강한 피지컬과 빠른 발을 가진 센터백. 나폴리에서 세리에 A 최우수 수비수에 오른 뒤 바이에른 뮌헨으로 이적했다.'},
  salah:{origin:'이집트 가르비야주 나그리그',intro:'빠른 왼발 윙어로 리버풀에서 리그 우승과 득점왕을 여러 차례 차지한 이집트의 간판 선수.'},
  vini:{origin:'브라질 리우데자네이루주 상곤살루',intro:'화려한 드리블이 장점인 브라질 윙어. 레알 마드리드에서 챔피언스리그 우승을 경험했다.'},
  jude:{origin:'잉글랜드 스타워브리지',intro:'어린 나이에 도르트문트와 레알 마드리드의 중심이 된 잉글랜드 미드필더. 동생 조브도 프로 선수다.'},
  modric:{origin:'크로아티아 자다르',intro:'레알 마드리드에서 오랫동안 중원을 지배한 크로아티아 미드필더. 2018 발롱도르 수상자로 현재 AC 밀란에서 뛰고 있다.'},
  neymar:{origin:'브라질 상파울루주 모지다스크루지스',intro:'화려한 기술과 창의력으로 알려진 브라질 공격수. 산투스에서 시작해 유럽과 중동을 거쳐 다시 산투스로 돌아왔다.'},
  debruyne:{origin:'벨기에 헨트',intro:'정확한 패스와 시야로 맨체스터 시티 전성기를 이끈 벨기에 미드필더. 현재 나폴리에서 뛰고 있다.'},
  kolo:{origin:'코트디부아르 부아케',intro:'아스널의 무패 우승 시즌 주전 수비수였던 코트디부아르 선수. 동생 야야와 맨체스터 시티에서 함께 뛰었다.'},
  yaya:{origin:'코트디부아르 부아케',intro:'바르셀로나와 맨체스터 시티에서 활약한 힘 좋은 미드필더. 형 콜로 투레와 맨체스터 시티에서 함께 뛰었다.'}
};
