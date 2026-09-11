export function sceneArt(id){
  const scene = body => `<svg class="world-scene-art" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  if(id==='jungle') return scene(`
    <g opacity=".9">
      <path d="M72 400 Q92 245 88 90" stroke="#3d7c4b" stroke-width="32" stroke-linecap="round"/>
      <path d="M1120 400 Q1088 252 1110 92" stroke="#397548" stroke-width="36" stroke-linecap="round"/>
      <g fill="#79c86a"><ellipse cx="120" cy="82" rx="94" ry="48" transform="rotate(-18 120 82)"/><ellipse cx="52" cy="160" rx="80" ry="40" transform="rotate(30 52 160)"/><ellipse cx="1085" cy="90" rx="94" ry="48" transform="rotate(18 1085 90)"/><ellipse cx="1150" cy="168" rx="85" ry="42" transform="rotate(-28 1150 168)"/></g>
      <g fill="#a0db7d" opacity=".75"><circle cx="280" cy="122" r="12"/><circle cx="940" cy="92" r="10"/><circle cx="815" cy="165" r="8"/></g>
      <path d="M0 360 Q145 300 286 355 T565 350 T860 355 T1200 348 V400 H0Z" fill="#4f9850" opacity=".38"/>
    </g>`);
  if(id==='farm') return scene(`
    <g opacity=".88">
      <circle cx="1030" cy="88" r="54" fill="#ffd66f" opacity=".7"/>
      <path d="M120 400 V255 M235 400 V252 M345 400 V258 M455 400 V255 M565 400 V258 M675 400 V254 M785 400 V258 M895 400 V254 M1005 400 V258 M1115 400 V252" stroke="#d8a965" stroke-width="18"/>
      <path d="M55 302 H1160 M55 350 H1160" stroke="#e5bc78" stroke-width="18" stroke-linecap="round"/>
      <path d="M790 270 L910 185 L1030 270 V390 H790Z" fill="#d97c58" opacity=".72"/>
      <path d="M760 275 L910 165 L1060 275" fill="none" stroke="#b95c47" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
      <rect x="875" y="305" width="70" height="85" rx="8" fill="#f5d7a1" opacity=".8"/>
      <path d="M0 372 Q180 338 340 370 T680 368 T1010 370 T1200 364 V400 H0Z" fill="#77ba63" opacity=".42"/>
    </g>`);
  if(id==='ocean') return scene(`
    <g opacity=".88">
      <path d="M0 286 Q90 252 180 286 T360 286 T540 286 T720 286 T900 286 T1080 286 T1260 286 V400 H0Z" fill="#48b4cc" opacity=".38"/>
      <g fill="none" stroke="#79c97a" stroke-width="18" stroke-linecap="round"><path d="M90 400 Q70 335 95 280 Q118 235 100 185"/><path d="M1080 400 Q1050 340 1082 285 Q1110 238 1090 190"/><path d="M1015 400 Q995 352 1015 315"/></g>
      <g fill="#f29b72" opacity=".72"><path d="M185 400 Q180 330 220 300 Q250 330 245 400Z"/><path d="M950 400 Q950 340 990 315 Q1022 345 1015 400Z"/></g>
      <g fill="none" stroke="#d8f8ff" stroke-width="6" opacity=".65"><circle cx="180" cy="150" r="16"/><circle cx="210" cy="100" r="10"/><circle cx="1010" cy="132" r="18"/><circle cx="1045" cy="82" r="9"/><circle cx="690" cy="190" r="12"/></g>
      <path d="M0 382 Q145 345 285 378 T565 376 T850 378 T1200 374 V400 H0Z" fill="#2f97b1" opacity=".3"/>
    </g>`);
  return scene(`
    <g opacity=".9">
      <rect x="80" y="250" width="130" height="150" rx="32" fill="#ff9fc4" opacity=".42"/>
      <rect x="235" y="205" width="155" height="195" rx="36" fill="#8fd3c8" opacity=".4"/>
      <rect x="415" y="270" width="120" height="130" rx="28" fill="#ffd867" opacity=".45"/>
      <rect x="895" y="228" width="150" height="172" rx="34" fill="#ad92e8" opacity=".4"/>
      <rect x="1065" y="282" width="92" height="118" rx="28" fill="#70cfe9" opacity=".42"/>
      <path d="M650 388 V236 L720 168 L790 236 V388Z" fill="#ffb5a8" opacity=".38"/>
      <g fill="none" stroke="#fff" stroke-width="7" opacity=".72"><circle cx="150" cy="152" r="42"/><circle cx="340" cy="110" r="29"/><circle cx="560" cy="150" r="36"/><circle cx="840" cy="112" r="33"/><circle cx="1080" cy="150" r="44"/></g>
      <g fill="#fff" opacity=".56"><circle cx="164" cy="138" r="9"/><circle cx="352" cy="100" r="7"/><circle cx="852" cy="101" r="8"/></g>
      <path d="M0 382 Q155 350 310 380 T620 378 T930 380 T1200 376 V400 H0Z" fill="#78bcae" opacity=".22"/>
    </g>`);
}
