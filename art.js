const svg = body => `<svg class="game-art" viewBox="0 0 200 200" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const eye=(x,y,r=8)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#253b36"/><circle cx="${x-2}" cy="${y-3}" r="2.4" fill="#fff"/>`;
const smile=(y=128)=>`<path d="M78 ${y} Q100 ${y+18} 122 ${y}" fill="none" stroke="#704b42" stroke-width="6" stroke-linecap="round"/>`;
const cheek=(x,y,c='#ef8c8c')=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="7" fill="${c}" opacity=".45"/>`;
const face=(fill, extras='', muzzle='', ears='')=>svg(`${ears}<circle cx="100" cy="104" r="67" fill="${fill}"/><ellipse cx="78" cy="80" rx="24" ry="18" fill="#fff" opacity=".16"/>${extras}${eye(73,103)}${eye(127,103)}${muzzle||`<ellipse cx="100" cy="126" rx="31" ry="23" fill="#f4d7ae"/><circle cx="100" cy="121" r="7" fill="#654b43"/>${smile(132)}`}${cheek(54,125)}${cheek(146,125)}`);

function landAnimal(id){
  switch(id){
    case 'lion': return svg(`<circle cx="100" cy="105" r="83" fill="#c86e37"/><circle cx="100" cy="105" r="61" fill="#f0b75f"/><circle cx="59" cy="62" r="21" fill="#df914d"/><circle cx="141" cy="62" r="21" fill="#df914d"/>${eye(74,100)}${eye(126,100)}<ellipse cx="100" cy="126" rx="31" ry="24" fill="#f8d28f"/><path d="M92 118 Q100 111 108 118 L100 128Z" fill="#62483e"/>${smile(132)}`);
    case 'elephant': return svg(`<ellipse cx="47" cy="105" rx="40" ry="52" fill="#87a9b8"/><ellipse cx="153" cy="105" rx="40" ry="52" fill="#87a9b8"/><circle cx="100" cy="102" r="62" fill="#9fc0ce"/><ellipse cx="78" cy="79" rx="22" ry="16" fill="#fff" opacity=".15"/>${eye(76,98)}${eye(124,98)}<path d="M91 119 Q101 112 110 121 L113 163 Q105 178 94 164Z" fill="#90b2c0"/><circle cx="79" cy="126" r="7" fill="#6a8792"/><circle cx="121" cy="126" r="7" fill="#6a8792"/>`);
    case 'monkey': return svg(`<circle cx="45" cy="107" r="29" fill="#8b5b3e"/><circle cx="155" cy="107" r="29" fill="#8b5b3e"/><circle cx="100" cy="100" r="66" fill="#8f5d3f"/><ellipse cx="100" cy="112" rx="48" ry="49" fill="#dba873"/>${eye(76,96)}${eye(124,96)}<ellipse cx="100" cy="127" rx="27" ry="20" fill="#efd1a7"/><circle cx="92" cy="123" r="4" fill="#6a4839"/><circle cx="108" cy="123" r="4" fill="#6a4839"/>${smile(134)}`);
    case 'giraffe': return svg(`<rect x="73" y="35" width="54" height="128" rx="28" fill="#e8bb5d"/><circle cx="72" cy="45" r="12" fill="#8d653d"/><circle cx="128" cy="45" r="12" fill="#8d653d"/><rect x="67" y="43" width="10" height="26" rx="5" fill="#c89249"/><rect x="123" y="43" width="10" height="26" rx="5" fill="#c89249"/><ellipse cx="100" cy="109" rx="49" ry="54" fill="#efc86d"/><circle cx="77" cy="82" r="10" fill="#a4743d"/><circle cx="126" cy="121" r="9" fill="#a4743d"/><circle cx="92" cy="143" r="8" fill="#a4743d"/>${eye(80,105)}${eye(120,105)}<ellipse cx="100" cy="133" rx="28" ry="20" fill="#f5d997"/><circle cx="91" cy="130" r="4" fill="#74513e"/><circle cx="109" cy="130" r="4" fill="#74513e"/>${smile(138)}`);
    case 'panda': return svg(`<circle cx="55" cy="55" r="25" fill="#2f3b39"/><circle cx="145" cy="55" r="25" fill="#2f3b39"/><circle cx="100" cy="105" r="67" fill="#f4f1e8"/><ellipse cx="73" cy="102" rx="20" ry="25" fill="#34413f" transform="rotate(20 73 102)"/><ellipse cx="127" cy="102" rx="20" ry="25" fill="#34413f" transform="rotate(-20 127 102)"/>${eye(73,102,6)}${eye(127,102,6)}<ellipse cx="100" cy="132" rx="29" ry="23" fill="#fff"/><circle cx="100" cy="125" r="7" fill="#34413f"/>${smile(135)}`);
    case 'frog': return svg(`<circle cx="62" cy="66" r="28" fill="#68b75e"/><circle cx="138" cy="66" r="28" fill="#68b75e"/><circle cx="100" cy="112" r="67" fill="#76c86a"/><circle cx="62" cy="66" r="16" fill="#fff"/>${eye(62,66,8)}<circle cx="138" cy="66" r="16" fill="#fff"/>${eye(138,66,8)}<ellipse cx="75" cy="124" rx="6" ry="4" fill="#4f8f4e"/><ellipse cx="125" cy="124" rx="6" ry="4" fill="#4f8f4e"/><path d="M66 139 Q100 168 134 139" fill="none" stroke="#4b7b48" stroke-width="7" stroke-linecap="round"/>`);
    case 'tiger': return svg(`<path d="M48 66 L65 38 L80 67Z" fill="#e88b3d"/><path d="M152 66 L135 38 L120 67Z" fill="#e88b3d"/><circle cx="100" cy="105" r="67" fill="#f39b49"/><path d="M70 56 L83 85" stroke="#513c34" stroke-width="8" stroke-linecap="round"/><path d="M130 56 L117 85" stroke="#513c34" stroke-width="8" stroke-linecap="round"/><path d="M98 43 L98 77" stroke="#513c34" stroke-width="8" stroke-linecap="round"/>${eye(75,103)}${eye(125,103)}<ellipse cx="100" cy="130" rx="32" ry="24" fill="#f7d29f"/><path d="M92 120 Q100 114 108 120 L100 130Z" fill="#5e463e"/>${smile(136)}`);
    case 'zebra': return svg(`<path d="M48 68 L65 37 L80 68Z" fill="#f6f4eb"/><path d="M152 68 L135 37 L120 68Z" fill="#f6f4eb"/><circle cx="100" cy="105" r="67" fill="#f8f7f1"/><path d="M65 56 L78 87 M88 42 L95 82 M112 43 L106 82 M137 57 L123 88" stroke="#33413f" stroke-width="9" stroke-linecap="round"/>${eye(76,105)}${eye(124,105)}<ellipse cx="100" cy="132" rx="31" ry="24" fill="#d8d5ca"/><circle cx="90" cy="127" r="5" fill="#43504c"/><circle cx="110" cy="127" r="5" fill="#43504c"/>${smile(138)}`);
    case 'hippo': return svg(`<circle cx="60" cy="63" r="22" fill="#8f7ba8"/><circle cx="140" cy="63" r="22" fill="#8f7ba8"/><circle cx="100" cy="104" r="67" fill="#9f8bb6"/>${eye(77,100)}${eye(123,100)}<ellipse cx="100" cy="135" rx="46" ry="31" fill="#bca9ce"/><circle cx="84" cy="129" r="6" fill="#766787"/><circle cx="116" cy="129" r="6" fill="#766787"/><path d="M79 145 Q100 158 121 145" fill="none" stroke="#766787" stroke-width="6" stroke-linecap="round"/>`);
    case 'rabbit': return svg(`<ellipse cx="70" cy="48" rx="20" ry="47" fill="#eee9de" transform="rotate(-8 70 48)"/><ellipse cx="130" cy="48" rx="20" ry="47" fill="#eee9de" transform="rotate(8 130 48)"/><ellipse cx="70" cy="47" rx="9" ry="31" fill="#f1b4b4"/><ellipse cx="130" cy="47" rx="9" ry="31" fill="#f1b4b4"/><circle cx="100" cy="111" r="62" fill="#f5f1e8"/>${eye(77,106)}${eye(123,106)}<ellipse cx="100" cy="132" rx="29" ry="23" fill="#fff"/><path d="M94 122 Q100 117 106 122 L100 129Z" fill="#d98686"/>${smile(136)}`);
    case 'cow': return svg(`<path d="M46 67 Q32 48 46 39 Q61 47 67 65Z" fill="#d9c483"/><path d="M154 67 Q168 48 154 39 Q139 47 133 65Z" fill="#d9c483"/><circle cx="100" cy="104" r="67" fill="#f4f0e7"/><path d="M55 72 Q74 50 90 70 Q83 100 59 103Z" fill="#3e4b48"/><path d="M122 130 Q141 117 157 136 Q145 158 125 153Z" fill="#3e4b48"/>${eye(77,103)}${eye(123,103)}<ellipse cx="100" cy="135" rx="39" ry="28" fill="#efb2b1"/><circle cx="86" cy="133" r="5" fill="#a86f71"/><circle cx="114" cy="133" r="5" fill="#a86f71"/>${smile(142)}`);
    case 'horse': return svg(`<path d="M52 71 L69 38 L82 72Z" fill="#9a633f"/><path d="M148 71 L131 38 L118 72Z" fill="#9a633f"/><path d="M127 43 Q155 66 144 121" fill="none" stroke="#6f4632" stroke-width="18" stroke-linecap="round"/><ellipse cx="100" cy="107" rx="58" ry="68" fill="#a96f47"/>${eye(78,103)}${eye(122,103)}<ellipse cx="100" cy="139" rx="35" ry="26" fill="#c88d62"/><circle cx="88" cy="135" r="5" fill="#6d4938"/><circle cx="112" cy="135" r="5" fill="#6d4938"/>${smile(144)}`);
    case 'duck': return svg(`<circle cx="100" cy="103" r="66" fill="#f0cb55"/>${eye(77,94)}${eye(123,94)}<path d="M63 119 Q100 98 137 119 Q100 151 63 119Z" fill="#ef8b45"/><circle cx="75" cy="123" r="8" fill="#e8a24a" opacity=".45"/><circle cx="125" cy="123" r="8" fill="#e8a24a" opacity=".45"/>`);
    case 'cat': return svg(`<path d="M48 75 L61 37 L86 68Z" fill="#d79254"/><path d="M152 75 L139 37 L114 68Z" fill="#d79254"/><circle cx="100" cy="106" r="66" fill="#e5a45f"/>${eye(76,102)}${eye(124,102)}<path d="M93 120 Q100 114 107 120 L100 128Z" fill="#a15f5f"/>${smile(132)}<path d="M45 123 L79 127 M42 137 L78 134 M155 123 L121 127 M158 137 L122 134" stroke="#735342" stroke-width="4" stroke-linecap="round"/>`);
    default:return face('#e2b878');
  }
}

function seaAnimal(id){
  switch(id){
    case 'fish': return svg(`<path d="M40 100 Q74 56 132 74 Q150 80 161 100 Q150 120 132 126 Q74 144 40 100Z" fill="#f4a65b"/><path d="M38 100 L12 70 L12 130Z" fill="#e9864d"/>${eye(126,91,7)}<path d="M139 109 Q149 115 157 108" fill="none" stroke="#7b5546" stroke-width="5" stroke-linecap="round"/><path d="M71 77 Q89 98 71 123" fill="none" stroke="#f8c57f" stroke-width="8"/>`);
    case 'turtle': return svg(`<ellipse cx="103" cy="108" rx="62" ry="48" fill="#6eaf69"/><path d="M58 108 Q103 62 148 108 Q103 154 58 108Z" fill="#7fc47a" stroke="#57965d" stroke-width="6"/><circle cx="166" cy="106" r="24" fill="#8bcc83"/>${eye(172,100,5)}<ellipse cx="48" cy="75" rx="21" ry="10" fill="#79bd73" transform="rotate(-25 48 75)"/><ellipse cx="48" cy="141" rx="21" ry="10" fill="#79bd73" transform="rotate(25 48 141)"/>`);
    case 'dolphin': return svg(`<path d="M25 114 Q65 56 130 76 Q155 82 175 64 Q172 93 151 104 Q130 151 72 143 Q45 139 25 114Z" fill="#6abed8"/><path d="M96 83 L112 48 L126 86Z" fill="#5aaac4"/><path d="M151 104 Q176 111 189 102 Q178 125 151 122Z" fill="#5aaac4"/>${eye(132,94,6)}<path d="M143 110 Q151 116 158 110" fill="none" stroke="#3d788b" stroke-width="4" stroke-linecap="round"/>`);
    case 'octopus': return svg(`<circle cx="100" cy="85" r="55" fill="#a883d5"/><path d="M50 122 Q38 165 65 171 Q84 171 78 137 M82 130 Q77 178 100 178 Q118 174 111 133 M116 132 Q119 178 142 171 Q160 159 145 124" fill="none" stroke="#a883d5" stroke-width="22" stroke-linecap="round"/>${eye(78,85)}${eye(122,85)}${smile(108)}`);
    case 'crab': return svg(`<ellipse cx="100" cy="112" rx="56" ry="43" fill="#ee755d"/><path d="M55 91 Q28 72 22 94 Q28 118 53 107 M145 91 Q172 72 178 94 Q172 118 147 107" fill="none" stroke="#ee755d" stroke-width="14" stroke-linecap="round"/><circle cx="78" cy="72" r="15" fill="#ee755d"/><circle cx="122" cy="72" r="15" fill="#ee755d"/>${eye(78,72,7)}${eye(122,72,7)}<path d="M75 126 Q100 144 125 126" fill="none" stroke="#9f4e47" stroke-width="6" stroke-linecap="round"/>`);
    case 'whale': return svg(`<path d="M25 113 Q59 62 123 75 Q164 82 177 116 Q157 146 106 145 Q55 145 25 113Z" fill="#6eaccf"/><path d="M160 100 Q183 79 193 91 Q189 112 165 120Z" fill="#5b99bd"/><path d="M88 78 L100 50 L111 82Z" fill="#5b99bd"/>${eye(132,103,6)}<path d="M141 119 Q151 126 160 119" fill="none" stroke="#477a97" stroke-width="5" stroke-linecap="round"/><path d="M99 55 Q94 34 83 26 M100 55 Q105 34 116 26" fill="none" stroke="#80cfe4" stroke-width="6" stroke-linecap="round"/>`);
    case 'shark': return svg(`<path d="M18 110 Q58 67 128 79 Q160 84 183 104 Q158 137 103 139 Q54 139 18 110Z" fill="#7f9eac"/><path d="M92 80 L106 43 L122 84Z" fill="#6c8b99"/><path d="M156 101 L190 82 L181 116Z" fill="#6c8b99"/>${eye(137,98,6)}<path d="M131 117 Q146 128 159 114" fill="#fff" stroke="#5e727b" stroke-width="3"/><path d="M137 117 L142 124 L148 117 L153 122" fill="none" stroke="#5e727b" stroke-width="3"/>`);
    default:return seaAnimal('fish');
  }
}

export function animalArt(id){return ['fish','turtle','dolphin','octopus','crab','whale','shark'].includes(id)?seaAnimal(id):landAnimal(id)}

export function shapeArt(id){
  const c='#fff7df', s='#315b50';
  const body={
    circle:`<circle cx="100" cy="100" r="61" fill="${c}" stroke="${s}" stroke-width="10"/>`,
    square:`<rect x="42" y="42" width="116" height="116" rx="18" fill="${c}" stroke="${s}" stroke-width="10"/>`,
    triangle:`<path d="M100 35 L165 158 L35 158Z" fill="${c}" stroke="${s}" stroke-width="10" stroke-linejoin="round"/>`,
    star:`<path d="M100 27 L119 75 L171 79 L131 112 L144 164 L100 135 L56 164 L69 112 L29 79 L81 75Z" fill="${c}" stroke="${s}" stroke-width="9" stroke-linejoin="round"/>`,
    heart:`<path d="M100 163 C82 142 42 119 42 79 C42 52 72 39 100 66 C128 39 158 52 158 79 C158 119 118 142 100 163Z" fill="${c}" stroke="${s}" stroke-width="9"/>`
  }[id]||'';
  return svg(body);
}

export function worldArt(id){
  if(id==='jungle') return svg(`<path d="M39 154 Q47 86 99 46 Q143 75 158 154Z" fill="#70b866"/><path d="M100 154 Q91 111 104 64" fill="none" stroke="#477b48" stroke-width="12" stroke-linecap="round"/><ellipse cx="71" cy="91" rx="38" ry="23" fill="#8fd178" transform="rotate(-28 71 91)"/><ellipse cx="128" cy="105" rx="40" ry="23" fill="#78c46e" transform="rotate(25 128 105)"/>`);
  if(id==='farm') return svg(`<path d="M40 91 L100 48 L160 91 V158 H40Z" fill="#f1c86c"/><path d="M28 94 L100 39 L172 94" fill="none" stroke="#d86d4f" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><rect x="78" y="111" width="44" height="47" rx="7" fill="#b86b4c"/><path d="M88 158 L88 123 L112 158" fill="none" stroke="#f5dcc0" stroke-width="6"/>`);
  if(id==='ocean') return svg(`<path d="M22 89 Q52 65 82 89 T142 89 T198 89 V158 H22Z" fill="#72cce1"/><path d="M25 116 Q55 92 85 116 T145 116 T198 116" fill="none" stroke="#d8f7ff" stroke-width="11" stroke-linecap="round"/><circle cx="65" cy="55" r="12" fill="#b8edf5"/><circle cx="93" cy="38" r="8" fill="#b8edf5"/>`);
  return svg(`<circle cx="70" cy="76" r="26" fill="#ffcf67"/><rect x="42" y="104" width="48" height="48" rx="13" fill="#ff93bd"/><path d="M127 49 L160 108 L94 108Z" fill="#88d4c6"/><circle cx="145" cy="142" r="24" fill="#9f8de5"/><circle cx="100" cy="100" r="78" fill="none" stroke="#ffffff" stroke-width="7" opacity=".75"/>`);
}

export function uiArt(name){
  const map={
    star:`<path d="M100 28 L119 74 L169 78 L130 109 L143 159 L100 132 L57 159 L70 109 L31 78 L81 74Z" fill="#ffd15f" stroke="#e6aa32" stroke-width="8" stroke-linejoin="round"/>`,
    medal:`<path d="M69 29 L91 83 L72 105 L45 42Z" fill="#78b8e8"/><path d="M131 29 L109 83 L128 105 L155 42Z" fill="#a28be4"/><circle cx="100" cy="122" r="48" fill="#ffd15f" stroke="#e6aa32" stroke-width="8"/><path d="M100 93 L110 114 L133 117 L116 133 L120 156 L100 145 L80 156 L84 133 L67 117 L90 114Z" fill="#fff4c4"/>`,
    trophy:`<path d="M66 42 H134 V88 Q134 126 100 138 Q66 126 66 88Z" fill="#ffd15f" stroke="#dc9d2f" stroke-width="8"/><path d="M66 57 H38 Q38 91 70 96 M134 57 H162 Q162 91 130 96" fill="none" stroke="#dc9d2f" stroke-width="10" stroke-linecap="round"/><rect x="91" y="135" width="18" height="25" rx="7" fill="#dc9d2f"/><rect x="69" y="157" width="62" height="17" rx="8" fill="#f2b948"/>`,
    sound:`<path d="M42 84 H72 L108 54 V146 L72 116 H42Z" fill="#315b50"/><path d="M126 78 Q147 100 126 122 M140 61 Q176 100 140 139" fill="none" stroke="#315b50" stroke-width="9" stroke-linecap="round"/>`,
    muted:`<path d="M42 84 H72 L108 54 V146 L72 116 H42Z" fill="#315b50"/><path d="M126 78 L159 122 M159 78 L126 122" stroke="#d65b57" stroke-width="10" stroke-linecap="round"/>`,
    play:`<circle cx="100" cy="100" r="66" fill="#fff" opacity=".16"/><path d="M82 65 L140 100 L82 135Z" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`,
    back:`<path d="M74 52 L124 100 L74 148" fill="none" stroke="#315b50" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M120 100 H50" fill="none" stroke="#315b50" stroke-width="16" stroke-linecap="round"/>`,
    replay:`<path d="M64 76 Q85 49 121 58 Q154 66 160 100 Q165 135 136 151 Q107 168 76 151 Q55 139 48 117" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round"/><path d="M64 76 L50 48 M64 76 L35 75" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`,
    bubbleface:`<circle cx="100" cy="100" r="72" fill="#5fc9d8"/><ellipse cx="75" cy="71" rx="25" ry="14" fill="#fff" opacity=".3" transform="rotate(-20 75 71)"/>${eye(76,101,7)}${eye(124,101,7)}<path d="M79 126 Q100 145 121 126" fill="none" stroke="#315b50" stroke-width="7" stroke-linecap="round"/>${cheek(58,122,'#ffb4c0')}${cheek(142,122,'#ffb4c0')}`
  };
  return svg(map[name]||map.star);
}

export function choiceArt(kind,id){
  if(kind==='animal') return animalArt(id);
  if(kind==='shape') return shapeArt(id);
  return '';
}
