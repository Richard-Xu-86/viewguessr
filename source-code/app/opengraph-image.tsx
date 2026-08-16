import {
  ogAlt,
  ogSize,
  ogContentType,
  renderBrandImage,
} from "@/components/OgImage";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return renderBrandImage();
}
