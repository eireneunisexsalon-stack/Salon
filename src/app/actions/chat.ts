'use server';

export async function getChatResponse(message: string) {
  const msg = message.toLowerCase();
  
  // Custom logic for Eirene Salon
  if (msg.includes('booking') || msg.includes('book') || msg.includes('appointment')) {
    return "You can book an appointment by clicking the 'Reserve a Chair' button on the home page or by visiting the '/book' page. We require a 10% advance deposit via UPI to confirm your slot.";
  }
  
  if (msg.includes('artist') || msg.includes('who') || msg.includes('stylist') || msg.includes('anu') || msg.includes('sandeep')) {
    return "We have two master artists: Anu (Expert in Hair Styling & Makeup) and Sandeep (Master Barber & Grooming Expert). Both have years of experience in luxury grooming.";
  }
  
  if (msg.includes('salon') || msg.includes('where') || msg.includes('location')) {
    return "Eirene Salon is a premium unisex salon focused on providing a luxury grooming experience. We are located at Premium Salon Hub, and we're open from 10:00 AM to 08:30 PM daily.";
  }
  
  if (msg.includes('price') || msg.includes('cost') || msg.includes('service')) {
    return "We offer a wide range of services for both men and women, including Hair, Skin, Makeup, and Nails. You can find the full price list on our 'Services' page.";
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! Welcome to Eirene Salon. How can I help you today? I can tell you about our artists, services, or how to book an appointment.";
  }
  
  if (msg.includes('nails')) {
    return "Yes! We offer premium nail services including Gel Extensions, Nail Art, and luxury Manicures. Check our Services page for more details.";
  }

  if (msg.includes('academy')) {
    return "Eirene Academy offers professional courses in Hair Styling and Grooming. Please contact us at 7087726684 for more details on enrollment.";
  }

  // Default response
  return "That's a great question! For specific details, it's best to check our Services page or visit us at the salon. You can also call us directly at 7087726684.";
}
