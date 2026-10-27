export default function LeadHoneypot() {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                left: '-10000px',
                width: 1,
                height: 1,
                overflow: 'hidden',
            }}
        >
            <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
        </div>
    )
}
