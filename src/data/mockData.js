// ════════════════════════════════════════════════════════════════
//  MOCK DATA & IN-MEMORY DATABASE
//  Used in demo/development mode.
//  In production this is replaced by Firestore.
// ════════════════════════════════════════════════════════════════

export const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

export const LGA_MAP = {
  "Anambra":   ["Aguata","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
  "Lagos":     ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
  "Rivers":    ["Abua-Odual","Ahoada East","Ahoada West","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio-Akpor","Ogba-Egbema-Ndoni","Ogu-Bolo","Okrika","Omuma","Opobo-Nkoro","Oyigbo","Port Harcourt","Tai"],
  "Kano":      ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Malam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
  "FCT – Abuja":["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
  "Kaduna":    ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  "Borno":     ["Abadam","Askira-Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala-Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
  "Oyo":       ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
  "Imo":       ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West","Unuimo"],
  "Edo":       ["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Orhionmwon","Oredo","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
};

export const ALERT_TYPES = {
  BANDIT:  { label:"Banditry",         color:"#e53e3e", icon:"⚔️",  sms:"BANDIT ALERT"   },
  KIDNAP:  { label:"Kidnapping",       color:"#d69e2e", icon:"🚨",  sms:"KIDNAP ALERT"   },
  FLOOD:   { label:"Flood Warning",    color:"#3182ce", icon:"🌊",  sms:"FLOOD ALERT"    },
  FIRE:    { label:"Fire Outbreak",    color:"#dd6b20", icon:"🔥",  sms:"FIRE ALERT"     },
  CULT:    { label:"Cult Activity",    color:"#805ad5", icon:"⚠️",  sms:"SECURITY ALERT" },
  PROTEST: { label:"Civil Unrest",     color:"#2d3748", icon:"📢",  sms:"UNREST ALERT"   },
  ACCIDENT:{ label:"Major Accident",   color:"#718096", icon:"🚗",  sms:"ACCIDENT ALERT" },
  TERROR:  { label:"Terror Threat",    color:"#c53030", icon:"💣",  sms:"TERROR ALERT"   },
  DISEASE: { label:"Disease Outbreak", color:"#00897b", icon:"🦠",  sms:"HEALTH ALERT"   },
  ROBBERY: { label:"Armed Robbery",    color:"#b7410e", icon:"🔫",  sms:"ROBBERY ALERT"  },
};

export const SEVERITY_COLOR = { CRITICAL:"#e53e3e", HIGH:"#dd6b20", MODERATE:"#d69e2e", LOW:"#38a169" };
export const SEVERITY_BG    = { CRITICAL:"#fff5f5", HIGH:"#fffaf0", MODERATE:"#fffff0", LOW:"#f0fff4"  };

export const EMERGENCY_CONTACTS = [
  { icon:"🚔", name:"Nigeria Police Force",        number:"199",            available:"24/7" },
  { icon:"🚑", name:"NEMA Emergency",              number:"767",            available:"24/7" },
  { icon:"🏥", name:"National Ambulance Service",  number:"112",            available:"24/7" },
  { icon:"🔥", name:"Federal Fire Service",        number:"08039148754",    available:"24/7" },
  { icon:"🪖", name:"Nigerian Army Hotline",       number:"08156814965",    available:"24/7" },
  { icon:"🦠", name:"NCDC Disease Helpline",       number:"0800-970000-10", available:"24/7" },
  { icon:"⚡", name:"DSS Tip Line",               number:"08000767",       available:"24/7" },
];

// ── In-memory mock database ───────────────────────────────────────────────────
const SEED_ALERTS = [
  { id:"a1",  type:"BANDIT",  state:"Zamfara",     lga:"Anka",          severity:"CRITICAL", timestamp:Date.now()-600000,    msg:"Armed bandits reported on Anka-Birnin Magaji road. Avoid travel. Security forces deployed.",                            verified:true,  source:"Nigeria Police Force",     reportCount:14 },
  { id:"a2",  type:"KIDNAP",  state:"Kaduna",      lga:"Birnin Gwari",  severity:"HIGH",     timestamp:Date.now()-1920000,   msg:"Kidnapping incident near Birnin Gwari. Residents advised to stay indoors and alert police.",                           verified:true,  source:"DSS Intelligence",         reportCount:6  },
  { id:"a3",  type:"FLOOD",   state:"Benue",       lga:"Makurdi",       severity:"MODERATE", timestamp:Date.now()-3600000,   msg:"River Benue overflowing banks around Makurdi. Low-lying areas evacuate immediately.",                                 verified:true,  source:"NEMA",                     reportCount:22 },
  { id:"a4",  type:"FIRE",    state:"Lagos",       lga:"Mushin",        severity:"HIGH",     timestamp:Date.now()-7200000,   msg:"Fire outbreak at Ladipo Market, Mushin. LASG Fire Service responding. Avoid the area.",                              verified:true,  source:"Lagos State Fire Service", reportCount:9  },
  { id:"a5",  type:"CULT",    state:"Rivers",      lga:"Port Harcourt", severity:"HIGH",     timestamp:Date.now()-10800000,  msg:"Cult clash in Diobu axis. Stay away from Marine Base and Eagle Cement areas.",                                       verified:false, source:"Community Report",         reportCount:4  },
  { id:"a6",  type:"BANDIT",  state:"Katsina",     lga:"Jibia",         severity:"CRITICAL", timestamp:Date.now()-18000000,  msg:"Bandit attack on Jibia-Kankia highway. Multiple casualties. Road closed by security forces.",                        verified:true,  source:"Nigeria Army",             reportCount:31 },
  { id:"a7",  type:"TERROR",  state:"Borno",       lga:"Maiduguri",     severity:"CRITICAL", timestamp:Date.now()-21600000,  msg:"IED detonation on outskirts of Maiduguri. Security forces on high alert. Avoid outskirts.",                         verified:true,  source:"Military Intelligence",    reportCount:18 },
  { id:"a8",  type:"PROTEST", state:"Oyo",         lga:"Ibadan North",  severity:"LOW",      timestamp:Date.now()-28800000,  msg:"Civil demonstration along Ring Road, Ibadan. Traffic diverted. Remain calm.",                                        verified:true,  source:"Oyo State Government",    reportCount:3  },
  { id:"a9",  type:"DISEASE", state:"Anambra",     lga:"Onitsha South", severity:"MODERATE", timestamp:Date.now()-43200000,  msg:"Suspected cholera outbreak in parts of Onitsha South. Drink clean water only. NCDC notified.",                       verified:false, source:"Community Report",         reportCount:7  },
  { id:"a10", type:"ROBBERY", state:"FCT – Abuja", lga:"Bwari",         severity:"HIGH",     timestamp:Date.now()-54000000,  msg:"Armed robbery attacks in Bwari area. Police on patrol. Secure homes by 9 PM.",                                       verified:true,  source:"FCT Police Command",       reportCount:11 },
];

export const MOCK_DB = {
  _alerts:      [...SEED_ALERTS],
  _reportCount: 0,

  getAlerts:      ()        => [...MOCK_DB._alerts].sort((a, b) => b.timestamp - a.timestamp),
  getReportCount: ()        => MOCK_DB._reportCount,

  addAlert(data) {
    const alert = { ...data, id: `a${Date.now()}`, timestamp: Date.now(), reportCount: 0 };
    MOCK_DB._alerts.unshift(alert);
    return alert;
  },

  addReport() {
    MOCK_DB._reportCount += 1;
  },
};
