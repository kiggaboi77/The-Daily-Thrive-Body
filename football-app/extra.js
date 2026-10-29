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
