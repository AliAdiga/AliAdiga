// Hand-built anime-style portrait (vector, drawn locally from the owner's own photo: short dark hair,
// round tortoise glasses, full beard, blue polo with white trim, arms crossed, calm closed-eye smile).
// Returns an SVG fragment in a 400x480 box. t supplies the background tint only.
export function portrait(t, id = "p") {
  const skin = "#e8b595", skinShade = "#c98d6e", skinHi = "#f6d2b8";
  const hair = "#2a1b15", hairHi = "#5a3c2c", beard = "#4a2b1d", beardHi = "#6e4430";
  const polo = "#1d6b9e", poloDark = "#134a70", poloHi = "#3a8cc2", trim = "#f4efe7";
  const frame = "#3b2a22";
  return `
<g id="${id}">
  <defs>
    <clipPath id="${id}-polo"><path d="M24 480 C 30 392 92 350 148 338 L 252 338 C 308 350 370 392 376 480 Z"/></clipPath>
    <clipPath id="${id}-box"><rect width="400" height="480" rx="28"/></clipPath>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.plum}"/><stop offset="1" stop-color="${t.plumDeep}"/></linearGradient>
    <radialGradient id="${id}-sun" cx="0.5" cy="0.38" r="0.6"><stop offset="0" stop-color="${t.bronze}" stop-opacity="0.9"/><stop offset="1" stop-color="${t.bronze}" stop-opacity="0"/></radialGradient>
  </defs>
  <g clip-path="url(#${id}-box)">
    <rect width="400" height="480" fill="url(#${id}-bg)"/>
    <rect width="400" height="480" fill="url(#${id}-sun)"/>
    <!-- speed lines radiating from behind the head -->
    <g stroke="${t.card}" stroke-opacity="0.16" stroke-width="3" stroke-linecap="round">
      ${Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2, r1 = 118, r2 = 330 + (i % 3) * 40;
        return `<line x1="${(200 + Math.cos(a) * r1).toFixed(1)}" y1="${(185 + Math.sin(a) * r1).toFixed(1)}" x2="${(200 + Math.cos(a) * r2).toFixed(1)}" y2="${(185 + Math.sin(a) * r2).toFixed(1)}"/>`;
      }).join("")}
    </g>
    <circle cx="200" cy="185" r="108" fill="none" stroke="${t.bronze}" stroke-opacity="0.7" stroke-width="2.5"/>

    <!-- shoulders / polo -->
    <path d="M24 480 C 30 392 92 350 148 338 L 252 338 C 308 350 370 392 376 480 Z" fill="${polo}"/>
    <path d="M24 480 C 30 392 92 350 148 338 L 164 340 C 120 366 84 410 78 480 Z" fill="${poloDark}" opacity="0.55"/>
    <!-- knit ribbing -->
    <g stroke="${poloHi}" stroke-opacity="0.35" stroke-width="2" clip-path="url(#${id}-polo)">
      ${Array.from({ length: 16 }, (_, i) => `<line x1="${60 + i * 19}" y1="352" x2="${54 + i * 19.5}" y2="480"/>`).join("")}
    </g>
    <!-- collar with white trim -->
    <path d="M150 336 L196 396 L246 336 L270 342 L210 420 L184 420 L132 344 Z" fill="${poloDark}"/>
    <path d="M150 336 L132 344 L184 420" fill="none" stroke="${trim}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M250 336 L270 342 L210 420" fill="none" stroke="${trim}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- crossed arms -->
    <g>
      <path d="M40 430 C 60 392 130 392 196 404 L 214 444 C 150 448 84 456 52 470 Z" fill="${skin}"/>
      <path d="M40 430 C 52 410 90 396 134 396 C 96 408 66 426 52 470 Z" fill="${skinShade}" opacity="0.6"/>
      <path d="M360 430 C 340 392 270 392 204 404 L 186 444 C 250 448 316 456 348 470 Z" fill="${skin}"/>
      <path d="M200 400 C 232 396 270 394 300 400 C 270 412 236 420 214 444 Z" fill="${skinHi}" opacity="0.55"/>
      <!-- hands on opposite arms -->
      <path d="M268 410 C 296 404 316 410 326 424 C 306 428 288 430 268 430 Z" fill="${skinShade}" opacity="0.55"/>
      <!-- smart watch -->
      <rect x="116" y="396" width="26" height="30" rx="9" fill="#1b1b1f" transform="rotate(-8 129 411)"/>
      <circle cx="129" cy="411" r="8" fill="#2f3a46" transform="rotate(-8 129 411)"/>
    </g>

    <!-- neck -->
    <path d="M168 276 L168 342 C 184 358 216 358 232 342 L232 276 Z" fill="${skin}"/>
    <path d="M168 276 L168 342 C 176 350 188 354 200 356 L200 276 Z" fill="${skinShade}" opacity="0.45"/>

    <!-- ears -->
    <ellipse cx="124" cy="196" rx="12" ry="22" fill="${skin}"/>
    <ellipse cx="276" cy="196" rx="12" ry="22" fill="${skin}"/>
    <ellipse cx="124" cy="198" rx="5" ry="12" fill="${skinShade}" opacity="0.7"/>
    <ellipse cx="276" cy="198" rx="5" ry="12" fill="${skinShade}" opacity="0.7"/>

    <!-- head -->
    <path d="M128 168 C 128 112 164 92 200 92 C 236 92 272 112 272 168 C 274 232 252 292 200 296 C 148 292 126 232 128 168 Z" fill="${skin}"/>
    <path d="M128 168 C 128 130 146 104 172 96 C 150 130 150 176 160 220 C 166 250 182 276 200 296 C 148 292 126 232 128 168 Z" fill="${skinShade}" opacity="0.32"/>
    <!-- forehead light -->
    <path d="M170 128 C 190 120 214 120 232 128 C 218 140 188 142 170 128 Z" fill="${skinHi}" opacity="0.7"/>

    <!-- beard: cheeks, chin, moustache -->
    <path d="M128 196 C 126 240 146 296 200 308 C 254 296 274 240 272 196 C 266 222 250 240 232 246 C 222 238 210 236 200 238 C 190 236 178 238 168 246 C 150 240 134 222 128 196 Z" fill="${beard}"/>
    <path d="M142 240 C 156 276 176 296 200 302 C 224 296 244 276 258 240 C 246 262 226 276 200 280 C 174 276 154 262 142 240 Z" fill="${beardHi}" opacity="0.5"/>
    <path d="M168 248 C 180 238 192 242 200 246 C 208 242 220 238 232 248 C 222 256 210 254 200 252 C 190 254 178 256 168 248 Z" fill="${beard}"/>
    <!-- calm smile -->
    <path d="M186 262 C 194 270 206 270 214 262" fill="none" stroke="#7a3f33" stroke-width="3" stroke-linecap="round"/>
    <path d="M190 262 C 196 266 204 266 210 262" fill="${skinHi}" opacity="0.0"/>

    <!-- nose -->
    <path d="M200 196 C 196 214 192 224 196 230 C 200 232 206 232 208 230" fill="none" stroke="${skinShade}" stroke-width="3" stroke-linecap="round"/>

    <!-- hair: short, swept up, receding corners -->
    <path d="M124 176 C 116 124 140 74 200 68 C 262 74 286 126 276 176 C 270 150 262 132 246 120 C 230 112 214 112 200 116 C 186 112 170 112 154 120 C 138 132 130 150 124 176 Z" fill="${hair}"/>
    <path d="M150 118 C 164 92 188 82 214 84 C 190 88 172 100 162 122 Z" fill="${hairHi}" opacity="0.75"/>
    <path d="M214 84 C 238 88 258 104 266 128 C 252 110 236 100 214 96 Z" fill="${hairHi}" opacity="0.45"/>
    <!-- anime fringe strands -->
    <path d="M158 122 C 160 134 156 144 150 150 C 152 138 152 130 158 122 Z" fill="${hair}"/>
    <path d="M242 122 C 244 134 248 144 252 150 C 250 138 248 130 242 122 Z" fill="${hair}"/>

    <!-- eyebrows -->
    <path d="M146 166 C 158 156 174 156 186 162" fill="none" stroke="${hair}" stroke-width="6" stroke-linecap="round"/>
    <path d="M214 162 C 226 156 242 156 254 166" fill="none" stroke="${hair}" stroke-width="6" stroke-linecap="round"/>

    <!-- closed, smiling eyes -->
    <path d="M150 190 C 160 200 174 200 184 190" fill="none" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>
    <path d="M216 190 C 226 200 240 200 250 190" fill="none" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>

    <!-- round tortoise glasses -->
    <g fill="none" stroke="${frame}" stroke-width="5">
      <circle cx="167" cy="190" r="29"/>
      <circle cx="233" cy="190" r="29"/>
      <path d="M196 188 C 199 184 201 184 204 188" stroke-width="4"/>
      <path d="M138 186 L 124 182 M262 186 L 276 182" stroke-width="4"/>
    </g>
    <g fill="#ffffff" fill-opacity="0.16">
      <circle cx="167" cy="190" r="28"/><circle cx="233" cy="190" r="28"/>
    </g>
    <path d="M148 178 C 154 168 166 164 176 166" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>
    <path d="M214 178 C 220 168 232 164 242 166" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>
    <!-- cheek blush -->
    <ellipse cx="146" cy="222" rx="14" ry="7" fill="#e0836f" opacity="0.32"/>
    <ellipse cx="254" cy="222" rx="14" ry="7" fill="#e0836f" opacity="0.32"/>
  </g>
  <rect width="400" height="480" rx="28" fill="none" stroke="${t.bronze}" stroke-width="3"/>
</g>`;
}
