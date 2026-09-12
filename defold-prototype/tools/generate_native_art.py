#!/usr/bin/env python3
from pathlib import Path
import math
import subprocess
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cairosvg
import arabic_reshaper
from bidi.algorithm import get_display

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "generated"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1280, 720

def find_font():
    for p in [Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"), Path("/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf")]:
        if p.exists(): return str(p)
    try:
        return subprocess.check_output(["fc-match", "-f", "%{file}", "DejaVu Sans:style=Bold"], text=True).strip()
    except Exception as exc:
        raise RuntimeError("No Arabic-capable bold font found") from exc

FONT = find_font()

def save_png(image, name):
    path = OUT / name
    image.save(path, optimize=True)
    return path

def text_image(text, w, h, size, color, stroke=0, stroke_fill=(0,0,0,0), arabic=False):
    image = Image.new("RGBA", (w,h), (0,0,0,0))
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(FONT, size)
    shown = get_display(arabic_reshaper.reshape(text)) if arabic else text
    bbox = draw.textbbox((0,0), shown, font=font, stroke_width=stroke)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    x = (w-tw)/2 - bbox[0]
    y = (h-th)/2 - bbox[1] - 2
    draw.text((x,y), shown, font=font, fill=color, stroke_width=stroke, stroke_fill=stroke_fill)
    return image

def ocean_background():
    img = Image.new("RGBA", (W,H), (6,42,82,255))
    px = img.load(); top=(8,63,130); mid=(6,96,150); bot=(5,63,100)
    for y in range(H):
        t=y/(H-1)
        if t < .58:
            u=t/.58; c=tuple(int(top[i]*(1-u)+mid[i]*u) for i in range(3))
        else:
            u=(t-.58)/.42; c=tuple(int(mid[i]*(1-u)+bot[i]*u) for i in range(3))
        for x in range(W): px[x,y]=(*c,255)
    d=ImageDraw.Draw(img,"RGBA")
    for x in [190,430,720,1010]: d.polygon([(x-70,0),(x+45,0),(x+165,H),(x+20,H)], fill=(120,220,255,13))
    for x,y,r in [(120,130,14),(150,90,8),(205,185,9),(1100,130,16),(1060,85,8),(980,185,11),(780,115,7),(825,165,12)]:
        d.ellipse((x-r,y-r,x+r,y+r), outline=(214,249,255,130), width=3)
        d.ellipse((x-r+4,y-r+4,x-r+8,y-r+8), fill=(255,255,255,100))
    d.polygon([(0,630),(160,605),(330,625),(510,610),(690,628),(890,606),(1080,620),(1280,604),(1280,720),(0,720)], fill=(17,84,100,220))
    for x,base,heights,color in [(85,690,[95,130,75],(92,174,111,210)),(1120,690,[120,85,145],(79,166,104,210)),(1025,690,[70,95],(92,174,111,200))]:
        for j,height in enumerate(heights):
            xx=x+j*22; pts=[]
            for k in range(8): pts.append((xx+math.sin(k*.85+j)*10, base-k*height/7))
            d.line(pts, fill=color, width=10, joint="curve")
    d.rounded_rectangle((180,632,260,710), radius=28, fill=(236,127,105,155))
    d.rounded_rectangle((935,648,1015,712), radius=26, fill=(243,154,114,160))
    d.rounded_rectangle((350,35,930,115), radius=38, fill=(1,30,64,95), outline=(127,226,255,45), width=2)
    return img

def rounded_card():
    w,h=300,285; canvas=Image.new("RGBA",(w,h),(0,0,0,0)); shadow=Image.new("RGBA",(w,h),(0,0,0,0))
    sd=ImageDraw.Draw(shadow,"RGBA"); sd.rounded_rectangle((14,18,w-12,h-10), radius=38, fill=(0,15,45,85))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(8)))
    d=ImageDraw.Draw(canvas,"RGBA")
    d.rounded_rectangle((9,8,w-9,h-15), radius=36, fill=(240,252,255,218), outline=(159,235,255,210), width=4)
    d.rounded_rectangle((18,17,w-18,h-24), radius=30, outline=(255,255,255,100), width=2)
    return canvas

def focus_ring():
    image=Image.new("RGBA",(326,311),(0,0,0,0)); d=ImageDraw.Draw(image,"RGBA")
    for width,alpha in [(12,65),(8,110),(4,255)]: d.rounded_rectangle((8,8,318,303), radius=44, outline=(255,208,74,alpha), width=width)
    return image.filter(ImageFilter.GaussianBlur(.5))

def eye(x,y,r=8):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#253b36"/><circle cx="{x-2}" cy="{y-3}" r="2.4" fill="#fff"/>'

ANIMAL_SVG = {
"fish": f'''<path d="M43 103 L14 73 Q7 102 14 133Z" fill="#f07b53" stroke="#d56649" stroke-width="5" stroke-linejoin="round"/><path d="M86 71 Q101 48 116 71" fill="#ffd26f" stroke="#d99b42" stroke-width="5"/><path d="M86 135 Q101 158 116 135" fill="#ffd26f" stroke="#d99b42" stroke-width="5"/><path d="M38 103 C57 70 91 60 126 70 C146 75 160 87 169 103 C160 120 146 132 126 137 C91 147 57 136 38 103Z" fill="#ffad58" stroke="#d87a3d" stroke-width="5"/><path d="M75 77 Q88 103 75 129" fill="none" stroke="#fff0b8" stroke-width="9" stroke-linecap="round" opacity=".78"/><circle cx="50" cy="93" r="4" fill="#fff" opacity=".45"/>{eye(137,92,7)}<path d="M143 112 Q153 118 160 111" fill="none" stroke="#7b5546" stroke-width="5" stroke-linecap="round"/>''',
"turtle": f'''<ellipse cx="47" cy="77" rx="23" ry="11" fill="#82c77b" transform="rotate(-28 47 77)"/><ellipse cx="47" cy="140" rx="23" ry="11" fill="#82c77b" transform="rotate(28 47 140)"/><ellipse cx="131" cy="72" rx="20" ry="9" fill="#82c77b" transform="rotate(24 131 72)"/><ellipse cx="131" cy="145" rx="20" ry="9" fill="#82c77b" transform="rotate(-24 131 145)"/><ellipse cx="99" cy="108" rx="59" ry="45" fill="#78bf73" stroke="#4d9458" stroke-width="6"/><path d="M63 108 Q99 72 135 108 Q99 144 63 108Z" fill="#9ad383" stroke="#5aa361" stroke-width="5"/><path d="M99 77 V139 M69 108 H129 M77 86 L121 130 M121 86 L77 130" stroke="#69aa67" stroke-width="4" opacity=".65"/><circle cx="163" cy="107" r="24" fill="#91cf86" stroke="#5aa361" stroke-width="5"/>{eye(169,100,5)}<path d="M165 117 Q172 121 178 116" fill="none" stroke="#467b50" stroke-width="3.5" stroke-linecap="round"/>''',
"crab": f'''<ellipse cx="100" cy="115" rx="52" ry="40" fill="#f17862" stroke="#b95149" stroke-width="5"/><path d="M56 98 C35 75 17 78 20 97 C22 111 39 111 53 106 M144 98 C165 75 183 78 180 97 C178 111 161 111 147 106" fill="none" stroke="#f17862" stroke-width="15" stroke-linecap="round"/><path d="M52 133 L31 153 M64 143 L52 168 M148 133 L169 153 M136 143 L148 168" stroke="#d96355" stroke-width="9" stroke-linecap="round"/><circle cx="78" cy="76" r="16" fill="#f17862" stroke="#b95149" stroke-width="4"/><circle cx="122" cy="76" r="16" fill="#f17862" stroke="#b95149" stroke-width="4"/>{eye(78,76,7)}{eye(122,76,7)}<path d="M77 126 Q100 142 123 126" fill="none" stroke="#99443f" stroke-width="6" stroke-linecap="round"/>'''
}

def animal_image(name):
    svg=f'<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">{ANIMAL_SVG[name]}</svg>'
    return Image.open(BytesIO(cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=240, output_height=240))).convert("RGBA")

def swatch(color):
    size=180; image=Image.new("RGBA",(size,size),(0,0,0,0)); d=ImageDraw.Draw(image,"RGBA")
    d.ellipse((12,12,size-12,size-12), fill=(*color,255), outline=(255,255,255,220), width=5)
    d.ellipse((36,28,92,74), fill=(255,255,255,85)); d.arc((20,20,size-20,size-20), start=205, end=330, fill=(0,80,100,75), width=7)
    return image

def pack_sheet(items, cell_w, cell_h, cols, filename):
    rows=math.ceil(len(items)/cols); sheet=Image.new("RGBA",(cell_w*cols,cell_h*rows),(0,0,0,0))
    for index,(name,image) in enumerate(items):
        x=(index%cols)*cell_w+(cell_w-image.width)//2; y=(index//cols)*cell_h+(cell_h-image.height)//2
        sheet.alpha_composite(image,(x,y))
    save_png(sheet,filename)

def write_tilesource(image_name, cell_w, cell_h, names, filename):
    lines=[f'image: "/generated/{image_name}"',f"tile_width: {cell_w}",f"tile_height: {cell_h}","tile_margin: 0","tile_spacing: 0",'collision: ""','material_tag: "tile"']
    for index,name in enumerate(names,1):
        lines += ["animations {",f'  id: "{name}"',f"  start_tile: {index}",f"  end_tile: {index}","  playback: PLAYBACK_NONE","}"]
    lines.append("extrude_borders: 1")
    (OUT/filename).write_text("\n".join(lines)+"\n", encoding="utf-8")

def main():
    save_png(ocean_background(),"ocean_bg.png"); write_tilesource("ocean_bg.png",1280,720,["background"],"ocean_bg.tilesource")
    objects=[("card",rounded_card()),("focus",focus_ring()),("fish",animal_image("fish")),("turtle",animal_image("turtle")),("crab",animal_image("crab")),("swatch_yellow",swatch((255,215,103))),("swatch_red",swatch((255,129,118))),("swatch_blue",swatch((112,207,233)))]
    pack_sheet(objects,360,360,4,"ui_objects.png"); write_tilesource("ui_objects.png",360,360,[x[0] for x in objects],"ui_objects.tilesource")
    texts=[("title",text_image("BUBBLE SAFARI",520,76,48,(255,238,175,255),2,(26,74,94,255),False)),("prompt1",text_image("اختر السمكة",560,88,46,(255,255,255,255),1,(14,66,86,180),True)),("prompt2",text_image("اختر الكبير",560,88,46,(255,255,255,255),1,(14,66,86,180),True)),("prompt3",text_image("اختر الأزرق",560,88,46,(255,255,255,255),1,(14,66,86,180),True)),("hint",text_image("حرّك بالأسهم   •   موافق للاختيار",620,56,28,(221,248,255,235),0,(0,0,0,0),True)),("success",text_image("أحسنت!",380,120,58,(255,255,255,255),2,(25,100,70,180),True)),("tryagain",text_image("حاول مرة أخرى",440,100,42,(255,255,255,255),2,(120,40,40,180),True))]
    pack_sheet(texts,640,160,4,"ui_text.png"); write_tilesource("ui_text.png",640,160,[x[0] for x in texts],"ui_text.tilesource")
    labels=[("label_fish","سمكة"),("label_turtle","سلحفاة"),("label_crab","سلطعون"),("label_small","صغير"),("label_big","كبير"),("label_yellow","أصفر"),("label_red","أحمر"),("label_blue","أزرق")]
    label_items=[(name,text_image(text,230,64,33,(20,78,90,255),0,(0,0,0,0),True)) for name,text in labels]
    pack_sheet(label_items,260,80,4,"ui_labels.png"); write_tilesource("ui_labels.png",260,80,[x[0] for x in label_items],"ui_labels.tilesource")
    print("Generated native ocean art:")
    for p in sorted(OUT.iterdir()): print(f"  {p.name}: {p.stat().st_size} bytes")

if __name__ == "__main__": main()
