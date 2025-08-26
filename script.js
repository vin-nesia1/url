// Global Variables
let currentTab = 'text';
let logoImage = null;
let fileDataUrl = null;
let qrCode = null;

// Initialize QR Code
function initializeQRCode() {
    const size = parseInt(document.getElementById('qr-size')?.value || 350);
    const errorLevel = document.getElementById('error-level')?.value || 'H';
    
    qrCode = new QRCodeStyling({
        width: size,
        height: size,
        data: "",
        image: "",
        dotsOptions: { 
            color: "#6a0dad", 
            type: "square" 
        },
        backgroundOptions: { 
            color: "#ffffff" 
        },
        cornersSquareOptions: {
            type: "square"
        },
        cornersDotOptions: {
            type: "square"
        },
        imageOptions: { 
            crossOrigin: "anonymous", 
            margin: 5, 
            imageSize: 0.4,
            hideBackgroundDots: true
        },
        qrOptions: { 
            errorCorrectionLevel: errorLevel 
        }
    });

    // Hide everything initially - only show after generate button is clicked
    const qrContainer = document.getElementById("qr-code-container");
    if (qrContainer) {
        qrContainer.style.display = 'none';
    }
    
    const downloadButtons = document.querySelector('.download-buttons');
    if (downloadButtons) {
        downloadButtons.style.display = 'none';
    }
    
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
}

// Tab Management
function openTab(evt, tabName) {
    currentTab = tabName;
    
    // Remove active classes
    document.querySelectorAll('.tab-content').forEach(tc => {
        tc.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(tb => {
        tb.classList.remove('active');
    });
    
    // Add active classes
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    
    // Update QR info
    updateQRInfo(tabName);
}

// Update QR Info Display
function updateQRInfo(tabName) {
    const infoElement = document.getElementById('qr-type-info');
    const tabNames = {
        'text': '📝 Text/URL QR Code',
        'wifi': '📶 WiFi QR Code',
        'vcard': '👤 vCard Contact QR Code',
        'email': '📧 Email QR Code',
        'sms': '📱 SMS QR Code',
        'geo': '📍 Location QR Code',
        'file': '📁 File QR Code',
        'event': '🗓️ Event QR Code',
        'crypto': '💰 Cryptocurrency QR Code',
        'phone': '☎️ Phone QR Code',
        'whatsapp': '💬 WhatsApp QR Code',
        'social': '🌐 Social Media QR Code',
        'appstore': '📱 App Store QR Code',
        'multilang': '🌍 Multi-Language QR Code',
        'htmlcustom': '📄 HTML QR Code',
        'youtube': '🎥 YouTube QR Code',
        'spotify': '🎵 Spotify QR Code',
        'pdf': '📃 PDF QR Code'
    };
    if (infoElement) {
        infoElement.textContent = tabNames[tabName] || 'QR Code';
    }
}

// Generate QR Code
function generateQrCode() {
    let data = "";
    
    switch (currentTab) {
        case 'text':
            data = document.getElementById('text-input').value || "https://qr.vinnesia.my.id";
            break;
            
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value;
            const password = document.getElementById('wifi-password').value;
            const encryption = document.getElementById('wifi-encryption').value;
            const hidden = document.getElementById('wifi-hidden').checked;
            if (ssid) {
                data = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
            }
            break;
            
        case 'vcard':
            const name = document.getElementById('vcard-name').value;
            const phone = document.getElementById('vcard-phone').value;
            const email = document.getElementById('vcard-email').value;
            const org = document.getElementById('vcard-org').value;
            const url = document.getElementById('vcard-url').value;
            const title = document.getElementById('vcard-title').value;
            if (name) {
                data = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nURL:${url}\nTITLE:${title}\nEND:VCARD`;
            }
            break;
            
        case 'email':
            const emailTo = document.getElementById('email-to').value;
            const emailSubject = document.getElementById('email-subject').value;
            const emailBody = document.getElementById('email-body').value;
            if (emailTo) {
                data = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            }
            break;
            
        case 'sms':
            const smsTo = document.getElementById('sms-to').value;
            const smsBody = document.getElementById('sms-body').value;
            if (smsTo) {
                data = `SMSTO:${smsTo}:${encodeURIComponent(smsBody)}`;
            }
            break;
            
        case 'geo':
            const lat = document.getElementById('geo-lat').value;
            const lon = document.getElementById('geo-lon').value;
            const query = document.getElementById('geo-query').value;
            if (lat && lon) {
                data = `geo:${lat},${lon}${query ? `?q=${encodeURIComponent(query)}` : ''}`;
            }
            break;
            
        case 'file':
            data = fileDataUrl || "";
            break;
            
        case 'event':
            const summary = document.getElementById('event-summary').value;
            const start = document.getElementById('event-start').value.replace(/[-:T]/g, '').replace(/\.\d{3}Z?$/, '') + 'Z';
            const end = document.getElementById('event-end').value.replace(/[-:T]/g, '').replace(/\.\d{3}Z?$/, '') + 'Z';
            const location = document.getElementById('event-location').value;
            const description = document.getElementById('event-description').value;
            if (summary && start && end) {
                data = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${summary}\nDTSTART:${start}\nDTEND:${end}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
            }
            break;
            
        case 'crypto':
            const cryptoType = document.getElementById('crypto-type').value;
            const address = document.getElementById('crypto-address').value;
            const amount = document.getElementById('crypto-amount').value;
            const label = document.getElementById('crypto-label').value;
            if (address) {
                data = `${cryptoType}:${address}${amount ? `?amount=${amount}` : ''}${label ? `${amount ? '&' : '?'}label=${encodeURIComponent(label)}` : ''}`;
            }
            break;
            
        case 'phone':
            const phoneNumber = document.getElementById('phone-number').value;
            if (phoneNumber) {
                data = `tel:${phoneNumber}`;
            }
            break;
            
        case 'whatsapp':
            const whatsappNumber = document.getElementById('whatsapp-number').value;
            const whatsappMessage = document.getElementById('whatsapp-message').value;
            if (whatsappNumber) {
                data = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`;
            }
            break;
            
        case 'social':
            const platform = document.getElementById('social-platform').value;
            const username = document.getElementById('social-username').value;
            if (username) {
                switch (platform) {
                    case 'instagram': data = `https://instagram.com/${username}`; break;
                    case 'telegram': data = `https://t.me/${username}`; break;
                    case 'tiktok': data = `https://tiktok.com/@${username}`; break;
                    case 'twitter': data = `https://twitter.com/${username}`; break;
                    case 'facebook': data = `https://facebook.com/${username}`; break;
                    case 'linkedin': data = `https://linkedin.com/in/${username}`; break;
                }
            }
            break;
            
        case 'appstore':
            const appPlatform = document.getElementById('appstore-platform').value;
            const appId = document.getElementById('appstore-id').value;
            if (appId) {
                if (appPlatform === 'playstore') {
                    data = appId.startsWith('http') ? appId : `https://play.google.com/store/apps/details?id=${appId}`;
                } else if (appPlatform === 'appstore') {
                    data = appId.startsWith('http') ? appId : `https://apps.apple.com/app/id${appId}`;
                }
            }
            break;
            
        case 'multilang':
            const baseUrl = document.getElementById('multilang-baseurl').value;
            const langParam = document.getElementById('multilang-langparam').value;
            if (baseUrl && langParam) {
                data = `${baseUrl}?${langParam}`;
            }
            break;
            
        case 'htmlcustom':
            const htmlContent = document.getElementById('htmlcustom-content').value;
            if (htmlContent) {
                data = `data:text/html;base64,${btoa(htmlContent)}`;
            }
            break;
            
        case 'youtube':
            let youtubeUrl = document.getElementById('youtube-url').value;
            const embedMode = document.getElementById('youtube-embed').checked;
            if (youtubeUrl) {
                if (embedMode && youtubeUrl.includes('watch?v=')) {
                    youtubeUrl = youtubeUrl.replace('watch?v=', 'embed/');
                }
                data = youtubeUrl;
            }
            break;
            
        case 'spotify':
            const spotifyType = document.getElementById('spotify-type').value;
            const spotifyId = document.getElementById('spotify-id').value;
            if (spotifyId) {
                if (spotifyId.startsWith('https://open.spotify.com/')) {
                    data = spotifyId;
                } else {
                    data = `https://open.spotify.com/${spotifyType}/${spotifyId}`;
                }
            }
            break;
            
        case 'pdf':
            let pdfUrl = document.getElementById('pdf-url').value;
            const forceDownload = document.getElementById('pdf-download').checked;
            if (pdfUrl) {
                data = forceDownload ? `${pdfUrl}#download` : pdfUrl;
            }
            break;
    }

    // Ensure we have some data to generate QR code
    if (!data.trim()) {
        alert('⚠️ Mohon isi data terlebih dahulu sebelum generate QR code!');
        return;
    }

    // Get design options
    const dotColor = document.getElementById('dot-color')?.value || '#6a0dad';
    const bgColor = document.getElementById('bg-color')?.value || '#ffffff';
    const dotStyle = document.getElementById('dot-style')?.value || 'square';
    const cornerStyle = document.getElementById('corner-style')?.value || 'square';
    const qrSize = parseInt(document.getElementById('qr-size')?.value || 350);
    const errorLevel = document.getElementById('error-level')?.value || 'H';
    const logoSize = parseFloat(document.getElementById('logo-size')?.value || 0.4);
    const logoBackground = document.getElementById('logo-background')?.checked || true;
    const gradientType = document.getElementById('gradient-type')?.value || 'none';
    const gradientColor = document.getElementById('gradient-color')?.value || '#e91e63';

    // Show QR container and buttons
    const qrContainer = document.getElementById('qr-code-container');
    const downloadButtons = document.querySelector('.download-buttons');
    const actionButtons = document.querySelector('.action-buttons');
    
    if (qrContainer) {
        qrContainer.style.display = 'block';
        
        // Update QR container background
        let backgroundStyle = bgColor;
        if (gradientType === 'radial') {
            backgroundStyle = `radial-gradient(circle, ${bgColor} 0%, ${gradientColor} 100%)`;
        } else if (gradientType === 'linear') {
            backgroundStyle = `linear-gradient(135deg, ${bgColor} 0%, ${gradientColor} 100%)`;
        }
        qrContainer.style.background = backgroundStyle;
    }
    
    if (downloadButtons) {
        downloadButtons.style.display = 'flex';
    }
    
    if (actionButtons) {
        actionButtons.style.display = 'flex';
    }

    // Clear previous QR code
    const qrCodeDiv = document.getElementById("qr-code");
    if (qrCodeDiv) {
        qrCodeDiv.innerHTML = '';
    }

    // Create new QR code
    if (qrCode) {
        qrCode.update({
            width: qrSize,
            height: qrSize,
            data: data,
            image: logoImage,
            dotsOptions: { 
                color: dotColor, 
                type: dotStyle 
            },
            backgroundOptions: { 
                color: "transparent" 
            },
            cornersSquareOptions: {
                type: cornerStyle,
                color: dotColor
            },
            cornersDotOptions: {
                type: cornerStyle,
                color: dotColor
            },
            imageOptions: { 
                crossOrigin: "anonymous", 
                margin: 8, 
                imageSize: logoSize,
                hideBackgroundDots: logoBackground
            },
            qrOptions: { 
                errorCorrectionLevel: errorLevel 
            }
        });
        
        // Only append to DOM after user clicks generate
        qrCode.append(qrCodeDiv);
    }
}

// File Upload Handlers
document.addEventListener('DOMContentLoaded', function() {
    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    logoImage = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2048) {
                    alert('⚠️ File terlalu besar! Silakan gunakan file yang lebih kecil dari 2KB untuk QR code yang dapat dipindai dengan baik.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    fileDataUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Range Input Updates
    const qrSizeRange = document.getElementById('qr-size');
    if (qrSizeRange) {
        qrSizeRange.addEventListener('input', (e) => {
            const valueSpan = document.getElementById('qr-size-value');
            if (valueSpan) {
                valueSpan.textContent = e.target.value + 'px';
            }
        });
    }

    const logoSizeRange = document.getElementById('logo-size');
    if (logoSizeRange) {
        logoSizeRange.addEventListener('input', (e) => {
            const valueSpan = document.getElementById('logo-size-value');
            if (valueSpan) {
                valueSpan.textContent = Math.round(e.target.value * 100) + '%';
            }
        });
    }

    // Gradient Type Change
    const gradientType = document.getElementById('gradient-type');
    if (gradientType) {
        gradientType.addEventListener('change', (e) => {
            const gradientColorGroup = document.getElementById('gradient-color-group');
            if (gradientColorGroup) {
                gradientColorGroup.style.display = e.target.value === 'none' ? 'none' : 'block';
            }
        });
    }

    // Download Functions
    const downloadPng = document.getElementById('download-png');
    if (downloadPng) {
        downloadPng.addEventListener('click', () => {
            if (qrCode) {
                qrCode.download({ name: "vinnesia-qr-advanced", extension: "png" });
            }
        });
    }

    const downloadSvg = document.getElementById('download-svg');
    if (downloadSvg) {
        downloadSvg.addEventListener('click', () => {
            if (qrCode) {
                qrCode.download({ name: "vinnesia-qr-advanced", extension: "svg" });
            }
        });
    }

    // Additional Action Functions
    const copyData = document.getElementById('copy-data');
    if (copyData) {
        copyData.addEventListener('click', () => {
            let currentData = "";
            switch (currentTab) {
                case 'text':
                    currentData = document.getElementById('text-input')?.value || '';
                    break;
            }
            
            if (navigator.clipboard && currentData) {
                navigator.clipboard.writeText(currentData).then(() => {
                    alert('📋 Data QR berhasil disalin ke clipboard!');
                });
            } else {
                alert('📋 Tidak ada data untuk disalin atau clipboard tidak didukung');
            }
        });
    }

    const shareQr = document.getElementById('share-qr');
    if (shareQr) {
        shareQr.addEventListener('click', () => {
            if (navigator.share && qrCode) {
                qrCode.getRawData('png').then((blob) => {
                    const file = new File([blob], 'qr-code.png', { type: 'image/png' });
                    navigator.share({
                        title: 'QR Code dari VIN NESIA',
                        files: [file]
                    });
                });
            } else {
                alert('📤 Sharing tidak didukung pada perangkat ini');
            }
        });
    }

    const printQr = document.getElementById('print-qr');
    if (printQr) {
        printQr.addEventListener('click', () => {
            const qrContainer = document.getElementById('qr-code-container');
            if (qrContainer) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head><title>QR Code - VIN NESIA</title></head>
                        <body style="text-align: center; margin: 50px;">
                            <h2>QR Code - VIN NESIA</h2>
                            ${qrContainer.outerHTML}
                            <p>Generated at: ${new Date().toLocaleString()}</p>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        });
    }

    // Generate Button Event
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateBtn.innerHTML = '<span class="loading"></span> Generating...';
            
            setTimeout(() => {
                generateQrCode();
                generateBtn.innerHTML = '🚀 Generate Advanced QR Code';
            }, 500);
        });
    }

    // Initialize
    initializeQRCode();
    
    // Set initial active tab
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.classList.add('active');
    }
    updateQRInfo('text');
});

// Helper Functions
function showPrivacyPolicy() {
    alert('🔒 Privacy Policy\n\nVIN NESIA QR Generator menghormati privasi Anda. Kami tidak menyimpan atau mengirimkan data QR code Anda ke server kami. Semua pembuatan QR code dilakukan secara lokal di browser Anda.');
}

function showHelp() {
    alert('❓ Help & FAQ\n\n1. Pilih jenis QR dari tab\n2. Isi informasi yang diperlukan\n3. Kustomisasi opsi desain\n4. Klik Generate\n5. Download atau bagikan QR code Anda\n\nUntuk dukungan: support@vinnesia.my.id');
}
