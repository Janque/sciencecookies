import Image from "next/image";
import styles from "../styles/components/image-auto.module.scss";

export default function ImageAuto({ className, width, sizes, ...props }) {
    return (
        <div className={styles['image-auto'] + (className ? ' ' + className : '')} style={{ position: 'relative', width: (width || '100') + '%' }}>
            <Image fill sizes={sizes || '(max-width: 576px) 90vw, (max-width: 1200px) 80vw, 50vw'} style={{ objectFit: 'cover' }} {...props} />
        </div>
    )
}