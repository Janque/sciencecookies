import Image from "next/image";

export default function ImageRatio({ className, width, ratioHeight, sizes, ...props }) {
    return (
        <div className={className} style={{ position: 'relative', width: (width || '100') + '%', paddingTop: (ratioHeight || '100') + '%' }}>
            <Image fill sizes={sizes || '(max-width: 1200px) 25vw, 17vw'} style={{ objectFit: 'cover' }} {...props} />
        </div>
    )
}