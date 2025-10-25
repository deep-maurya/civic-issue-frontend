'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const QRCodePage = () => {
    const { qr_id } = useParams()
    return (
        <div>
        <h1>QR Code: {qr_id}</h1>
        </div>
    )
}

export default QRCodePage
