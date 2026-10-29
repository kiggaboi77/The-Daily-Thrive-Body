// 나라별 15개 구단(한국 K리그1은 1부 12개 구단) · 대표 선수 11명(4-3-3 순서)
// 순서: GK, RB, CB, CB, LB, DM, CM, CM, RW, ST, LW  /  선수 형식: 이름/포지션/주발(R,L,B)/국적코드, 모르면 '-'
// 2025-26 시즌 기준 대표 선수이며 기억 기반이라 포지션·주발·소속이 실제와 다를 수 있어요. 빈 칸은 API 탭 또는 구단 화면의 "API로 선수단 불러오기"로 채울 수 있어요.
const LEAGUES = [
{code:'ENG', ko:'잉글랜드', flag:'en', league:'프리미어리그', raw:`
아스널;Arsenal;#ef0107;#ffffff;Raya/GK/R/es,Timber/RB/R/nl,Saliba/CB/R/fr,Gabriel/CB/L/br,Calafiori/LB/L/it,Rice/DM/R/en,Zubimendi/CM/R/es,Ødegaard/CM/L/no,Saka/RW/L/en,Gyökeres/ST/R/se,Martinelli/LW/R/br
맨체스터 시티;Manchester City;#6cabdd;#ffffff;Donnarumma/GK/R/it,Rico Lewis/RB/R/en,Dias/CB/R/pt,Gvardiol/CB/L/hr,Aït-Nouri/LB/L/dz,Rodri/DM/R/es,Reijnders/CM/R/nl,Bernardo Silva/CM/L/pt,Foden/RW/R/en,Haaland/ST/L/no,Doku/LW/R/be
리버풀;Liverpool;#c8102e;#f6eb61;Alisson/GK/R/br,Frimpong/RB/R/nl,Konaté/CB/R/fr,van Dijk/CB/R/nl,Kerkez/LB/L/hu,Mac Allister/DM/R/ar,Szoboszlai/CM/R/hu,Wirtz/CM/R/de,Salah/RW/L/eg,Isak/ST/R/se,Gakpo/LW/R/nl
첼시;Chelsea;#034694;#ffffff;R. Sánchez/GK/R/es,James/RB/R/en,Colwill/CB/L/en,Fofana/CB/R/fr,Cucurella/LB/L/es,Caicedo/DM/R/ec,Enzo Fernández/CM/R/ar,Palmer/CM/L/en,Estêvão/RW/L/br,João Pedro/ST/R/br,Neto/LW/L/pt
맨체스터 유나이티드;Manchester United;#da291c;#fbe122;Lammens/GK/R/be,Dalot/RB/R/pt,de Ligt/CB/R/nl,L. Martínez/CB/L/ar,Shaw/LB/L/en,Casemiro/DM/R/br,Bruno Fernandes/CM/R/pt,Mainoo/CM/R/en,Mbeumo/RW/R/cm,Šeško/ST/R/si,Cunha/LW/R/br
토트넘 홋스퍼;Tottenham Hotspur;#132257;#ffffff;Vicario/GK/R/it,Porro/RB/R/es,Romero/CB/R/ar,van de Ven/CB/L/nl,Udogie/LB/L/it,Palhinha/DM/R/pt,Bentancur/CM/R/uy,Maddison/CM/R/en,Kudus/RW/R/gh,Solanke/ST/R/en,Johnson/LW/R/en
뉴캐슬 유나이티드;Newcastle United;#241f20;#ffffff;Pope/GK/R/en,Trippier/RB/R/en,Schär/CB/R/ch,Botman/CB/L/nl,Burn/LB/L/en,Guimarães/DM/R/br,Tonali/CM/R/it,Joelinton/CM/R/br,Elanga/RW/R/se,Woltemade/ST/R/de,Gordon/LW/R/en
아스톤 빌라;Aston Villa;#670e36;#95bfe5;E. Martínez/GK/R/ar,Cash/RB/R/pl,Konsa/CB/R/en,Pau Torres/CB/L/es,Digne/LB/L/fr,Kamara/DM/R/fr,Tielemans/CM/R/be,McGinn/CM/R/sct,Rogers/RW/R/en,Watkins/ST/R/en,Buendía/LW/R/ar
브라이턴;Brighton & Hove Albion;#0057b8;#ffffff;Verbruggen/GK/R/nl,Veltman/RB/R/nl,Dunk/CB/R/en,Van Hecke/CB/R/nl,Estupiñán/LB/L/ec,Baleba/DM/R/cm,Gross/CM/R/de,Wieffer/CM/R/nl,Minteh/RW/R/gm,Welbeck/ST/R/en,Mitoma/LW/R/jp
웨스트햄;West Ham United;#7a263a;#1bb1e7;Areola/GK/R/fr,Wan-Bissaka/RB/R/en,Todibo/CB/R/fr,Mavropanos/CB/R/gr,Diouf/LB/L/fr,Souček/DM/R/cz,Álvarez/CM/R/mx,Paquetá/CM/L/br,Bowen/RW/L/en,Füllkrug/ST/R/de,Summerville/LW/L/nl
크리스탈 팰리스;Crystal Palace;#1b458f;#c4122e;Henderson/GK/R/en,Muñoz/RB/R/co,Lacroix/CB/R/fr,Guéhi/CB/R/en,Mitchell/LB/L/en,Hughes/DM/R/en,Wharton/CM/R/en,Kamada/CM/R/jp,Sarr/RW/R/sn,Mateta/ST/R/fr,Pino/LW/R/es
풀럼;Fulham;#ffffff;#111111;Leno/GK/R/de,Tete/RB/R/nl,Bassey/CB/L/ng,Diop/CB/R/ma,Robinson/LB/L/us,Lukić/DM/R/rs,Berge/CM/R/no,Reed/CM/R/en,Wilson/RW/R/en,Jiménez/ST/R/mx,Kevin/LW/R/br
브렌트퍼드;Brentford;#e30613;#ffffff;Kelleher/GK/R/ie,Henry/RB/R/en,Collins/CB/R/en,van den Berg/CB/R/nl,Hickey/LB/L/sct,Nørgaard/DM/R/dk,Janelt/CM/R/de,Damsgaard/CM/R/dk,Schade/RW/R/de,Thiago/ST/R/br,Ouattara/LW/R/bf
에버턴;Everton;#003399;#ffffff;Pickford/GK/R/en,O'Brien/RB/R/ie,Tarkowski/CB/R/en,Keane/CB/R/en,Mykolenko/LB/L/ua,Gueye/DM/R/sn,Garner/CM/R/en,Dewsbury-Hall/CM/R/en,Ndiaye/RW/R/sn,Beto/ST/R/gw,Grealish/LW/R/en
노팅엄 포레스트;Nottingham Forest;#dd0000;#ffffff;Sels/GK/R/be,Aina/RB/R/ng,Murillo/CB/R/br,Milenković/CB/R/rs,Williams/LB/L/en,Sangaré/DM/R/ci,Anderson/CM/R/en,Gibbs-White/CM/R/en,Hudson-Odoi/RW/R/en,Wood/ST/R/nz,Jota Silva/LW/R/pt
`},
{code:'ESP', ko:'스페인', flag:'es', league:'라리가', raw:`
레알 마드리드;Real Madrid;#f5f5f5;#febe10;Courtois/GK/L/be,Carvajal/RB/R/es,Rüdiger/CB/R/de,Militão/CB/R/br,Carreras/LB/L/es,Tchouaméni/DM/R/fr,Valverde/CM/R/uy,Bellingham/CM/R/en,Rodrygo/RW/R/br,Mbappé/ST/R/fr,Vinícius Jr./LW/R/br
FC 바르셀로나;FC Barcelona;#a50044;#004d98;J. García/GK/R/es,Koundé/RB/R/fr,Cubarsí/CB/R/es,Araújo/CB/R/uy,Balde/LB/L/es,de Jong/DM/R/nl,Pedri/CM/R/es,Olmo/CM/R/es,Yamal/RW/L/es,Lewandowski/ST/R/pl,Raphinha/LW/L/br
아틀레티코 마드리드;Atlético Madrid;#cb3524;#272e61;Oblak/GK/R/si,Molina/RB/R/ar,Le Normand/CB/L/es,Giménez/CB/R/uy,Ruggeri/LB/L/it,Koke/DM/R/es,De Paul/CM/R/ar,Gallagher/CM/R/en,G. Simeone/RW/R/ar,Álvarez/ST/R/ar,Griezmann/LW/L/fr
아틀레틱 빌바오;Athletic Club;#ee2523;#ffffff;U. Simón/GK/R/es,De Marcos/RB/R/es,Vivian/CB/R/es,Laporte/CB/L/es,Yuri/LB/L/es,Vesga/DM/R/es,Jauregizar/CM/R/es,Sancet/CM/R/es,I. Williams/RW/R/gh,Guruzeta/ST/R/es,N. Williams/LW/R/es
레알 소시에다드;Real Sociedad;#0067b1;#ffffff;Remiro/GK/R/es,Aramburu/RB/R/ve,Zubeldia/CB/R/es,Caleta-Car/CB/R/hr,Sergio Gómez/LB/L/es,Turrientes/DM/R/es,Brais Méndez/CM/L/es,Sučić/CM/R/hr,Barrenetxea/RW/R/es,Oyarzabal/ST/R/es,Kubo/LW/L/jp
비야레알;Villarreal;#fbe10f;#005187;L. Júnior/GK/R/br,Foyth/RB/R/ar,Rafa Marín/CB/R/es,Veiga/CB/R/es,Pedraza/LB/L/es,Comesaña/DM/R/ar,Parejo/CM/R/es,Gueye/CM/R/sn,Pépé/RW/L/ci,Mikautadze/ST/R/ge,Buchanan/LW/R/ca
레알 베티스;Real Betis;#0bb363;#ffffff;Valles/GK/R/es,Bellerín/RB/R/es,Natan/CB/R/br,Bartra/CB/R/es,Perraud/LB/L/fr,Altimira/DM/R/es,Fornals/CM/L/es,Lo Celso/CM/L/ar,Antony/RW/L/br,Cucho/ST/R/co,Ezzalzouli/LW/R/ma
세비야;Sevilla FC;#f43333;#ffffff;Vlachodimos/GK/R/gr,Carmona/RB/R/es,Badé/CB/R/fr,Marcão/CB/R/br,Pedrosa/LB/L/es,Sow/DM/R/ch,Agoumé/CM/R/fr,Vargas/CM/R/ch,Lukebakio/RW/R/be,I. Romero/ST/R/es,Ejuke/LW/L/ng
발렌시아;Valencia CF;#f08a00;#111111;Dimitrievski/GK/R/mk,Foulquier/RB/R/fr,Tárrega/CB/R/es,Copete/CB/L/es,Gayà/LB/L/es,Guerra/DM/R/es,Barrenechea/CM/R/ar,Almeida/CM/R/es,D. López/RW/R/es,Hugo Duro/ST/R/es,Rioja/LW/R/es
지로나;Girona FC;#cd2534;#ffffff;Gazzaniga/GK/R/ar,Arnau/RB/R/es,D. López/CB/R/es,Krejčí/CB/L/cz,Miguel/LB/L/es,Witsel/DM/R/be,van de Beek/CM/R/nl,Ounahi/CM/R/ma,Tsygankov/RW/L/ua,Stuani/ST/R/uy,B. Gil/LW/L/es
셀타 비고;Celta de Vigo;#8ac3ee;#ffffff;Radu/GK/R/ro,Mingueza/RB/R/es,Starfelt/CB/R/se,M. Alonso/CB/L/es,Carreira/LB/L/es,Beltrán/DM/R/es,Moriba/CM/R/es,Swedberg/CM/R/se,Aspas/RW/R/es,B. Iglesias/ST/R/es,Jutglà/LW/R/es
오사수나;CA Osasuna;#d91a21;#0a346f;Herrera/GK/R/es,Areso/RB/R/es,Catena/CB/R/es,Boyomo/CB/R/cm,Bretones/LB/L/es,Torró/DM/R/es,Moncayola/CM/R/es,Muñoz/CM/R/es,R. García/RW/R/es,Budimir/ST/R/hr,Oroz/LW/R/es
마요르카;RCD Mallorca;#e20613;#111111;Greif/GK/R/sk,Maffeo/RB/R/es,Valjent/CB/R/sk,Raíllo/CB/R/es,Mojica/LB/L/co,Morlanes/DM/R/es,Samú Costa/CM/R/pt,Darder/CM/R/es,D. Rodríguez/RW/R/es,Muriqi/ST/R/xk,Asano/LW/R/jp
헤타페;Getafe CF;#005999;#ffffff;D. Soria/GK/R/es,Iglesias/RB/R/es,Duarte/CB/R/es,Djené/CB/R/tg,D. Rico/LB/L/es,Milla/DM/R/es,Arambarri/CM/R/uy,Mauro/CM/R/es,Uche/RW/R/ng,Mayoral/ST/R/es,C. Pérez/LW/L/es
라요 바예카노;Rayo Vallecano;#ffffff;#e53027;Batalla/GK/R/es,Ratiu/RB/R/ro,Lejeune/CB/R/es,Mumin/CB/L/es,Espino/LB/L/uy,Valentín/DM/R/es,U. López/CM/R/es,Ciss/CM/R/sn,Palazón/RW/R/es,De Frutos/ST/R/es,Camello/LW/R/es
`},
{code:'ITA', ko:'이탈리아', flag:'it', league:'세리에 A', raw:`
인터 밀란;Inter Milan;#0068a8;#111111;Sommer/GK/R/ch,Dumfries/RB/R/nl,Acerbi/CB/L/it,Bastoni/CB/L/it,Dimarco/LB/L/it,Calhanoğlu/DM/R/tr,Barella/CM/R/it,Mkhitaryan/CM/R/am,Luis Henrique/RW/R/br,Lautaro/ST/R/ar,M. Thuram/LW/R/fr
AC 밀란;AC Milan;#d4001c;#111111;Maignan/GK/R/fr,Emerson Royal/RB/R/br,Tomori/CB/R/en,Pavlović/CB/R/rs,Estupiñán/LB/L/ec,Modrić/DM/R/hr,Fofana/CM/R/fr,Rabiot/CM/L/fr,Pulisic/RW/R/us,Gimenez/ST/R/mx,Leão/LW/R/pt
유벤투스;Juventus;#111111;#ffffff;Di Gregorio/GK/R/it,Kalulu/RB/R/fr,Bremer/CB/R/br,Gatti/CB/R/it,Cambiaso/LB/R/it,Locatelli/DM/R/it,K. Thuram/CM/R/fr,Koopmeiners/CM/R/nl,Conceição/RW/R/pt,Vlahović/ST/L/rs,Yildiz/LW/L/tr
SSC 나폴리;SSC Napoli;#12a0d7;#ffffff;Meret/GK/R/it,Di Lorenzo/RB/R/it,Rrahmani/CB/R/xk,Buongiorno/CB/R/it,Spinazzola/LB/L/it,Lobotka/DM/R/sk,McTominay/CM/R/sct,De Bruyne/CM/R/be,Politano/RW/L/it,Højlund/ST/L/dk,Neres/LW/R/br
AS 로마;AS Roma;#8e1f2f;#f0bc42;Svilar/GK/R/rs,Çelik/RB/R/tr,Mancini/CB/R/it,Ndicka/CB/L/ci,Angeliño/LB/L/es,Cristante/DM/R/it,Koné/CM/R/fr,Pellegrini/CM/R/it,Soulé/RW/L/ar,Ferguson/ST/R/ie,El Shaarawy/LW/L/it
SS 라치오;SS Lazio;#87d8f7;#ffffff;Provedel/GK/R/it,Marušić/RB/R/me,Gila/CB/R/es,Romagnoli/CB/R/it,Nuno Tavares/LB/L/pt,Rovella/DM/R/it,Guendouzi/CM/R/fr,Vecino/CM/R/uy,Isaksen/RW/R/dk,Castellanos/ST/R/ar,Zaccagni/LW/L/it
아탈란타;Atalanta;#1e71b8;#111111;Carnesecchi/GK/R/it,Zappacosta/RB/R/it,Djimsiti/CB/R/al,Hien/CB/L/se,Kolašinac/LB/L/ba,de Roon/DM/R/nl,Éderson/CM/R/br,Pašalić/CM/R/hr,Lookman/RW/L/ng,Scamacca/ST/L/it,De Ketelaere/LW/R/be
피오렌티나;Fiorentina;#5b2b8c;#ffffff;De Gea/GK/R/es,Dodô/RB/R/br,Pongračić/CB/R/hr,Comuzzo/CB/R/it,Gosens/LB/L/de,Mandragora/DM/R/it,Fagioli/CM/R/it,Ndour/CM/R/it,Gudmundsson/RW/L/is,Kean/ST/R/it,Colpani/LW/R/it
볼로냐;Bologna FC;#1a2f48;#a21c26;Skorupski/GK/R/pl,Posch/RB/R/at,Beukema/CB/R/nl,Lucumí/CB/R/co,Miranda/LB/L/es,Freuler/DM/R/ch,Moro/CM/R/hr,Odgaard/CM/R/dk,Orsolini/RW/L/it,Castro/ST/R/ar,Cambiaghi/LW/R/it
토리노;Torino FC;#8b1a1a;#ffffff;Milinković-Savić/GK/R/rs,Pedersen/RB/L/no,Maripán/CB/R/cl,Coco/CB/R/it,Masina/LB/L/ma,Ilkhan/DM/R/tr,Casadei/CM/R/it,Ricci/CM/R/it,Lazaro/RW/R/at,Zapata/ST/R/co,Vlašić/LW/R/hr
제노아;Genoa CFC;#9b1c31;#10264d;Leali/GK/R/it,Sabelli/RB/R/it,Vásquez/CB/R/it,de Winter/CB/R/be,Martin/LB/L/es,Frendrup/DM/R/dk,Malinovskyi/CM/L/ua,Thorsby/CM/R/no,Zanoli/RW/R/it,Vitinha/ST/R/pt,Ekhator/LW/R/ng
코모;Como 1907;#1f5fa8;#ffffff;Butez/GK/R/fr,Smolčić/RB/R/hr,Diego Carlos/CB/R/br,Kempf/CB/R/de,Moreno/LB/L/es,Perrone/DM/R/ar,Sergi Roberto/CM/R/es,Da Cunha/CM/R/br,Nico Paz/RW/L/ar,Morata/ST/R/es,Baturina/LW/R/hr
우디네세;Udinese Calcio;#111111;#ffffff;Okoye/GK/R/ng,Ehizibue/RB/R/ng,Kristensen/CB/R/dk,Bijol/CB/R/si,Kamara/LB/L/fr,Karlström/DM/R/se,Lovrić/CM/R/si,Atta/CM/R/fr,Zaniolo/RW/R/it,Lucca/ST/R/it,Davis/LW/R/en
칼리아리;Cagliari Calcio;#a31b3e;#10264d;Caprile/GK/R/it,Zappa/RB/R/it,Mina/CB/R/co,Luperto/CB/L/it,Obert/LB/L/au,Adopo/DM/R/fr,Prati/CM/R/it,Mazzitelli/CM/R/it,Palestra/RW/R/it,Piccoli/ST/R/it,Luvumbo/LW/R/ao
파르마;Parma Calcio;#f3c300;#10264d;Suzuki/GK/R/jp,Delprato/RB/R/it,Circati/CB/R/au,Troilo/CB/R/it,Valeri/LB/L/it,Keita/DM/R/ci,Estévez/CM/R/ar,Bernabé/CM/R/es,Almqvist/RW/R/se,Pellegrino/ST/R/ar,Cancellieri/LW/L/it
`},
{code:'GER', ko:'독일', flag:'de', league:'분데스리가', raw:`
바이에른 뮌헨;Bayern Munich;#dc052d;#ffffff;Neuer/GK/R/de,Laimer/RB/R/at,Upamecano/CB/R/fr,Kim Min-jae/CB/R/kr,Davies/LB/L/ca,Kimmich/DM/R/de,Pavlović/CM/R/de,Musiala/CM/R/de,Olise/RW/L/fr,Kane/ST/R/en,Díaz/LW/R/co
보루시아 도르트문트;Borussia Dortmund;#fde100;#111111;Kobel/GK/R/ch,Ryerson/RB/R/no,Anton/CB/R/de,Schlotterbeck/CB/L/de,Bensebaini/LB/L/dz,Can/DM/R/de,Nmecha/CM/R/de,Brandt/CM/R/de,Beier/RW/R/de,Guirassy/ST/R/gn,Adeyemi/LW/R/de
바이어 레버쿠젠;Bayer Leverkusen;#e32221;#111111;Hradecký/GK/R/fi,Arthur/RB/R/br,Tapsoba/CB/R/bf,Quansah/CB/R/en,-,Palacios/DM/R/ar,Andrich/CM/R/de,Tillman/CM/R/us,-,Schick/ST/L/cz,-
RB 라이프치히;RB Leipzig;#dd0741;#ffffff;Gulácsi/GK/R/hu,Henrichs/RB/R/de,Orban/CB/R/hu,Lukeba/CB/L/fr,Raum/LB/L/de,Seiwald/DM/R/at,Schlager/CM/R/at,Baumgartner/CM/R/at,Diomande/RW/R/ci,-,Nusa/LW/R/no
아인트라흐트 프랑크푸르트;Eintracht Frankfurt;#e1000f;#111111;Zetterer/GK/R/de,-,Koch/CB/R/de,Theate/CB/L/be,-,Skhiri/DM/R/tn,Larsson/CM/R/se,-,-,Burkardt/ST/R/de,-
VfB 슈투트가르트;VfB Stuttgart;#e32219;#ffffff;Nübel/GK/R/de,Vagnoman/RB/R/de,Chabot/CB/L/de,Rouault/CB/R/fr,Mittelstädt/LB/L/de,Stiller/DM/R/de,Karazor/CM/R/de,Millot/CM/R/fr,Leweling/RW/R/de,Demirović/ST/R/ba,Führich/LW/R/de
SC 프라이부르크;SC Freiburg;#111111;#c8102e;Atubolu/GK/R/de,Kübler/RB/R/de,Ginter/CB/R/de,Lienhart/CB/R/at,Günter/LB/L/de,Eggestein/DM/R/de,Höfler/CM/R/de,-,Doan/RW/R/jp,Grifo/ST/L/it,Beste/LW/R/de
VfL 볼프스부르크;VfL Wolfsburg;#65b32e;#ffffff;Grabara/GK/R/pl,Maehle/RB/R/dk,Koulierakis/CB/R/gr,Vavro/CB/R/sk,Belocian/LB/L/fr,Arnold/DM/R/de,Svanberg/CM/R/se,Majer/CM/R/hr,T. Tomás/RW/R/pt,Wind/ST/R/dk,Amoura/LW/R/dz
묀헨글라트바흐;Borussia Mönchengladbach;#111111;#2a8a3a;Nicolas/GK/R/fr,Scally/RB/R/us,Elvedi/CB/R/ch,Friedrich/CB/R/ch,-,Weigl/DM/R/de,Reitz/CM/R/de,Sander/CM/R/de,Honorat/RW/R/fr,-,-
TSG 호펜하임;TSG Hoffenheim;#1c63b7;#ffffff;Baumann/GK/R/de,Kaderábek/RB/R/cz,Hranáč/CB/R/cz,-,Jurásek/LB/L/cz,Prömel/DM/R/de,-,-,-,Kramarić/ST/R/hr,-
마인츠 05;1. FSV Mainz 05;#c3141e;#ffffff;Zentner/GK/R/de,Mwene/RB/R/at,Hanche-Olsen/CB/R/no,Bell/CB/R/us,Caci/LB/L/fr,Kohr/DM/R/de,Sano/CM/R/jp,Lee Jae-sung/CM/R/kr,Nebel/RW/R/de,-,-
베르더 브레멘;Werder Bremen;#1d9053;#ffffff;Backhaus/GK/R/de,Weiser/RB/R/de,Friedl/CB/R/at,Pieper/CB/R/de,-,Stage/DM/R/de,-,Bittencourt/CM/R/de,-,-,-
우니온 베를린;1. FC Union Berlin;#eb1923;#ffffff;Rønnow/GK/R/dk,Juranović/RB/R/hr,Doekhi/CB/R/nl,Querfeld/CB/R/de,Leite/LB/L/pt,Khedira/DM/R/de,Trimmel/CM/R/at,Haberer/CM/R/de,-,-,-
FC 아우크스부르크;FC Augsburg;#ba3733;#ffffff;Dahmen/GK/R/de,Gumny/RB/R/pl,Gouweleeuw/CB/R/nl,-,Giannoulis/LB/L/gr,Jakić/DM/R/hr,Rexhbecaj/CM/R/xk,-,-,-,-
FC 장크트 파울리;FC St. Pauli;#6b3e26;#ffffff;Vasilj/GK/R/ba,-,-,-,-,-,-,-,-,-,-
`},
{code:'FRA', ko:'프랑스', flag:'fr', league:'리그 1', raw:`
파리 생제르맹;Paris Saint-Germain;#004170;#da291c;Chevalier/GK/R/fr,Hakimi/RB/R/ma,Marquinhos/CB/R/br,Pacho/CB/L/ec,Nuno Mendes/LB/L/pt,Vitinha/DM/R/pt,Lee Kang-in/CM/L/kr,J. Neves/CM/R/pt,Dembélé/RW/R/fr,Ramos/ST/R/pt,Kvaratskhelia/LW/R/ge
올림피크 마르세유;Olympique de Marseille;#2faee0;#ffffff;Rulli/GK/R/ar,Pavard/RB/R/fr,Balerdi/CB/R/ar,Egan-Riley/CB/R/en,Medina/LB/L/ar,O'Riley/DM/R/ie,Højbjerg/CM/R/dk,Ndiaye/CM/R/sn,Greenwood/RW/L/en,Aubameyang/ST/R/ga,Gouiri/LW/R/dz
AS 모나코;AS Monaco;#e30613;#ffffff;Köhn/GK/R/ch,Vanderson/RB/R/br,Salisu/CB/R/gh,Kehrer/CB/R/de,Caio Henrique/LB/L/br,Zakaria/DM/R/ch,Akliouche/CM/R/fr,Golovin/CM/R/ru,Ben Seghir/RW/R/ma,Embolo/ST/R/ch,Minamino/LW/R/jp
올림피크 리옹;Olympique Lyonnais;#1b2f5b;#e30613;Descamps/GK/R/fr,Maitland-Niles/RB/R/en,Mata/CB/R/fr,Niakhaté/CB/R/fr,Tagliafico/LB/L/ar,Tolisso/DM/R/fr,Tessmann/CM/R/us,Morton/CM/R/en,Šulc/RW/L/cz,Lacazette/ST/R/fr,Nuamah/LW/R/gh
릴 OSC;Lille OSC;#d2232a;#1c2d5a;Özer/GK/R/tr,Meunier/RB/R/be,Diakité/CB/R/fr,Alexsandro/CB/L/br,Ismaily/LB/L/br,André/DM/R/br,Bouaddi/CM/R/fr,Gomes/CM/R/en,-,-,-
OGC 니스;OGC Nice;#c8102e;#111111;Bulka/GK/R/pl,Mendy/RB/R/fr,Dante/CB/R/br,Bombito/CB/R/ca,Bard/LB/L/fr,Boudaoui/DM/R/dz,Diop/CM/R/fr,Sanson/CM/R/fr,Guessand/RW/R/ci,Laborde/ST/R/fr,Boga/LW/L/ci
RC 랑스;RC Lens;#e8b800;#d2232a;Risser/GK/R/fr,Aguilar/RB/R/fr,Danso/CB/R/at,Sarr/CB/R/fr,Gradit/LB/L/fr,Samed/DM/R/ma,Thomasson/CM/R/fr,-,Thauvin/RW/L/fr,-,Sotoca/LW/R/fr
스타드 렌;Stade Rennais;#c8102e;#111111;Samba/GK/R/cg,-,Faye/CB/R/sn,-,Truffert/LB/L/fr,-,-,-,-,-,-
스타드 브레스트;Stade Brestois;#e30613;#ffffff;Bizot/GK/R/fr,-,Chardonnet/CB/R/fr,-,-,Magnetti/DM/R/fr,Camara/CM/R/ml,-,-,Ajorque/ST/R/fr,-
스트라스부르;RC Strasbourg;#0b6fb8;#ffffff;Penders/GK/R/be,-,-,-,-,-,-,-,-,Emegha/ST/R/nl,-
툴루즈 FC;Toulouse FC;#6f3d94;#ffffff;-,-,Restes/CB/R/fr,-,-,-,-,-,-,-,-
FC 낭트;FC Nantes;#f7d000;#1c8b3b;-,-,-,-,-,-,-,-,-,-,-
AJ 오세르;AJ Auxerre;#1f68b0;#ffffff;-,-,-,-,-,-,-,-,-,-,-
르아브르 AC;Le Havre AC;#1e5ba8;#7bb7e6;-,-,-,-,-,-,-,-,-,-,-
앙제 SCO;Angers SCO;#111111;#ffffff;-,-,-,-,-,-,-,-,-,-,-
`},
{code:'KOR', ko:'대한민국', flag:'kr', league:'K리그1 (1부 12개 구단)', raw:`
전북 현대 모터스;Jeonbuk Hyundai Motors;#00a859;#fbe122;Song Bum-keun/GK/R/kr,-,Park Jin-seob/CB/R/kr,-,-,-,-,-,-,-,Lee Seung-woo/LW/R/kr
울산 HD;Ulsan HD;#0057b8;#f7b500;Jo Hyeon-woo/GK/R/kr,-,Kim Young-gwon/CB/R/kr,-,-,-,Lee Dong-gyeong/CM/R/kr,-,-,-,-
포항 스틸러스;Pohang Steelers;#d6001c;#111111;-,-,-,-,-,-,-,-,-,-,-
FC 서울;FC Seoul;#d31f2f;#111111;-,-,-,-,-,-,Lingard/CM/R/en,-,-,Cho Young-wook/ST/R/kr,-
대전 하나 시티즌;Daejeon Hana Citizen;#7a1b4d;#00a0a0;-,-,-,-,-,-,-,-,-,-,-
강원 FC;Gangwon FC;#f26522;#1c8b3b;-,-,-,-,-,-,-,-,-,-,-
김천 상무;Gimcheon Sangmu;#c8102e;#111111;-,-,-,-,-,-,-,-,-,-,-
광주 FC;Gwangju FC;#f3c300;#1c8b3b;-,-,-,-,-,-,-,-,-,-,-
인천 유나이티드;Incheon United;#1a3a8f;#6fb1e6;-,-,-,-,-,-,-,-,-,-,-
제주 SK;Jeju SK;#f26522;#ffffff;-,-,-,-,-,-,-,-,-,-,-
수원 FC;Suwon FC;#1f4fa8;#ffffff;-,-,-,-,-,-,-,-,-,-,-
FC 안양;FC Anyang;#5b2b8c;#ffffff;-,-,-,-,-,-,-,-,-,-,-
`}
];
