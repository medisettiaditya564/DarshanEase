import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a professional, institutional-grade PDF ticket for Darshan.
 * @param {Object} booking - The booking details
 */
export const generateTicketPDF = async (booking) => {
    // Create a temporary container for the ticket
    const ticketElement = document.createElement('div');
    ticketElement.style.position = 'absolute';
    ticketElement.style.left = '-9999px';
    ticketElement.style.top = '0';
    ticketElement.style.width = '794px'; // ~210mm at 96dpi
    ticketElement.style.padding = '40px';
    ticketElement.style.fontFamily = "'Poppins', sans-serif";
    ticketElement.style.backgroundColor = '#f4f4f4'; // Preview background

    const qrPlaceholder = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + booking._id;

    ticketElement.innerHTML = `
        <div style="width: 714px; margin: 0 auto; background: white; border-radius: 40px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.1); position: relative;">
            
            <!-- Header Section (Boarding Pass Style) -->
            <div style="background: #FF9933; padding: 60px 50px; color: white; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="font-size: 42px; font-weight: 900; margin: 0; letter-spacing: -1.5px; text-transform: uppercase;">Darshan Pass</h1>
                        <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 5px; margin: 10px 0 0 0; opacity: 0.8;">Institutional Ritual Credential</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 60px; font-weight: 900; opacity: 0.2; position: absolute; top: 20px; right: 40px; pointer-events: none;">ॐ</span>
                        <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0; opacity: 0.7;">Booking ID</p>
                        <p style="font-size: 18px; font-weight: 800; margin: 5px 0 0 0; letter-spacing: 1px;">#${booking._id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <!-- Notches (Pseudo Notches) -->
                <div style="position: absolute; bottom: -20px; left: -20px; width: 40px; height: 40px; background: #f4f4f4; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -20px; right: -20px; width: 40px; height: 40px; background: #f4f4f4; border-radius: 50%;"></div>
            </div>

            <!-- Main Body -->
            <div style="padding: 60px 50px;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 40px;">
                    
                    <!-- Destination -->
                    <div>
                        <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #FF9933; margin-bottom: 5px;">Sacred Destination</p>
                        <h2 style="font-size: 36px; font-weight: 900; color: #2D1B08; margin: 0; line-height: 1;">${booking.temple?.name}</h2>
                        <p style="font-size: 14px; color: #6B7280; font-weight: 600; margin-top: 10px;">${booking.temple?.location?.city}, ${booking.temple?.location?.state}</p>
                    </div>

                    <div style="height: 2px; background: repeating-linear-gradient(to right, #E5E7EB 0, #E5E7EB 10px, transparent 10px, transparent 20px); width: 100%;"></div>

                    <!-- Details Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                        <div>
                            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #9CA3AF; margin-bottom: 5px;">Primary Devotee</p>
                            <p style="font-size: 20px; font-weight: 800; color: #2D1B08; margin: 0;">${booking.user?.name}</p>
                        </div>
                        <div>
                            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #9CA3AF; margin-bottom: 5px;">Devotee Count</p>
                            <p style="font-size: 20px; font-weight: 800; color: #2D1B08; margin: 0;">${booking.tickets} Souls</p>
                        </div>
                        <div>
                            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #9CA3AF; margin-bottom: 5px;">Scheduled Date</p>
                            <p style="font-size: 20px; font-weight: 800; color: #2D1B08; margin: 0;">${new Date(booking.visitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                        </div>
                        <div>
                            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #9CA3AF; margin-bottom: 5px;">Arrival Timing</p>
                            <p style="font-size: 20px; font-weight: 800; color: #FF9933; margin: 0;">${booking.visitTime} SLOT</p>
                        </div>
                    </div>

                    <div style="height: 2px; background: repeating-linear-gradient(to right, #E5E7EB 0, #E5E7EB 10px, transparent 10px, transparent 20px); width: 100%; position: relative;">
                         <!-- Secondary Notches -->
                        <div style="position: absolute; top: -20px; left: -70px; width: 40px; height: 40px; background: #f4f4f4; border-radius: 50%;"></div>
                        <div style="position: absolute; top: -20px; right: -70px; width: 40px; height: 40px; background: #f4f4f4; border-radius: 50%;"></div>
                    </div>

                    <!-- Footer / QR Section -->
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #9CA3AF; margin-bottom: 5px;">Offering Tier</p>
                            <p style="font-size: 32px; font-weight: 900; color: #2D1B08; margin: 0;">₹${booking.totalAmount}</p>
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 15px;">
                                <div style="width: 10px; height: 10px; background: #059669; border-radius: 50%;"></div>
                                <span style="font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 2px;">Verified Secure</span>
                            </div>
                        </div>
                        <div style="padding: 15px; border: 2px solid #F3F4F6; border-radius: 20px; background: white;">
                            <img src="${qrPlaceholder}" style="width: 140px; height: 140px;" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Branding -->
            <div style="background: #FFF7ED; padding: 30px 50px; text-align: center; border-top: 2px solid #FFEDD5;">
                <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: #9A3412; margin: 0;">Verified by DarshanEase Institution • Non-Transferable</p>
            </div>
        </div>
    `;

    document.body.appendChild(ticketElement);

    try {
        const canvas = await html2canvas(ticketElement, {
            scale: 2, // Scale 2 is sufficient for A4 and much faster than 3
            backgroundColor: '#f4f4f4',
            useCORS: true,
            width: 794,
            height: 1123,
            logging: false,
            removeContainer: true // Faster cleanup
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Darshan_Pass_${booking._id.slice(-8)}.pdf`);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        document.body.removeChild(ticketElement);
    }
};
