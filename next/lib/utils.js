export function formatDate(d) {
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}

export function cookieCardBody(locale, title, description, authors, published, lineJump = true) {
    return (
        <>
            <h5 class="card-title">{title}</h5>
            <p class="card-text">{description}</p>
            <p class="card-text">
                {`${formatDate(new Date(published.seconds * 1000))}`}
                {lineJump ? <br /> : <span>&emsp;</span>}
                {`${locale == 'es' ? 'Autor(es)' : 'Author(s)'}: ${authors}`}
            </p>
        </>
    )
}