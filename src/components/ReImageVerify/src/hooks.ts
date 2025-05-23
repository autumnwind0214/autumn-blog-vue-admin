import { onMounted, ref } from "vue";
import { getCaptchaApi } from "@/api/login";

/**
 * 绘制图形验证码
 * @param width - 图形宽度
 * @param height - 图形高度
 */
export const useImageVerify = (width = 120, height = 40) => {
  const domRef = ref<HTMLCanvasElement>();
  const imgCode = ref("");
  const captchaId = ref("");

  function setImgCode(code: string) {
    imgCode.value = code;
  }

  function getImgCode() {
    if (!domRef.value) return;
    getCaptchaApi().then((result: any) => {
      imgCode.value = result.code;
      captchaId.value = result.captchaId;
      draw(domRef.value, width, height, imgCode.value);
    });
  }

  onMounted(() => {
    getImgCode();
  });

  return {
    domRef,
    captchaId,
    imgCode,
    setImgCode,
    getImgCode
  };
};

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomColor(min: number, max: number) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

function draw(
  dom: HTMLCanvasElement,
  width: number,
  height: number,
  imgCode: string
) {
  const ctx = dom.getContext("2d");
  if (!ctx) return imgCode;

  ctx.fillStyle = randomColor(180, 230);
  ctx.fillRect(0, 0, width, height);
  let i = 0;
  for (const text of imgCode) {
    const fontSize = randomNum(18, 41);
    const deg = randomNum(-30, 30);
    ctx.font = `${fontSize}px Simile`;
    ctx.textBaseline = "top";
    ctx.fillStyle = randomColor(80, 150);
    ctx.save();
    ctx.translate(30 * i++ + 15, 15);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, -15 + 5, -15);
    ctx.restore();
  }
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.strokeStyle = randomColor(180, 230);
    ctx.closePath();
    ctx.stroke();
  }
  for (let i = 0; i < 41; i += 1) {
    ctx.beginPath();
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = randomColor(150, 200);
    ctx.fill();
  }
}
