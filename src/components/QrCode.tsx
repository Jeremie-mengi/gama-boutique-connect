import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
  size?: number;
  className?: string;
}

const QrCode = ({ value, size = 64, className }: Props) => (
  <div className={`inline-flex items-center justify-center rounded-md bg-white p-1 ${className ?? ""}`}>
    <QRCodeSVG value={value} size={size} level="M" />
  </div>
);

export default QrCode;
