'use server';

export async function getChatResponse(message: string) {
  const msg = message.toLowerCase();
  
  // Custom logic for Eirene Salon
  if (msg.includes('booking') || msg.includes('book') || msg.includes('appointment') || msg.includes('reserve')) {
    return "You can book an appointment by clicking the 'Reserve a Chair' button on the home page or by visiting the '/book' page. We require a 10% advance deposit via UPI to confirm your slot.";
  }
  
  if (msg.includes('artist') || msg.includes('who') || msg.includes('stylist') || msg.includes('anu') || msg.includes('sandeep') || msg.includes('staff')) {
    return "Our master artists are industry leaders: Anu is an expert in High-Definition Makeup and Advanced Hair Styling, while Sandeep is our Master Barber specializing in precision fades and beard architecture. They both focus on creating a personalized look that suits your personality.";
  }

  if (msg.includes('best') || msg.includes('why') || msg.includes('choose') || msg.includes('special') || msg.includes('quality')) {
    return "Eirene Salon is Bikaner's premier luxury destination. We stand out because of our obsession with hygiene, use of world-class international products, and a team that is trained in the latest global trends. We don't just give a haircut; we provide a complete transformation experience.";
  }

  if (msg.includes('style') || msg.includes('styling') || msg.includes('look') || msg.includes('trend') || msg.includes('fashion')) {
    return "From red-carpet makeup and bridal styling to modern hair transformations, we specialize in high-end styling. Our experts stay updated with global fashion trends to ensure you always walk out with a look that's sharp, modern, and perfectly tailored for you.";
  }
  
  if (msg.includes('salon') || msg.includes('where') || msg.includes('location') || msg.includes('address') || msg.includes('bikaner')) {
    return "Eirene Unisex Salon is located in Bikaner, Rajasthan. We are a premium destination for luxury grooming, open from 10:00 AM to 08:30 PM daily.";
  }
  
  if (msg.includes('price') || msg.includes('cost') || msg.includes('service') || msg.includes('menu') || msg.includes('rate')) {
    return "We offer a wide range of services including Hair Cuts, Balayage, Facials, Makeup, and Nail Art. You can check our complete 'Services' page for detailed pricing. Currently, we also have a 'Grand Opening Offer' with 30% OFF!";
  }

  if (msg.includes('offer') || msg.includes('discount') || msg.includes('promo') || msg.includes('sale')) {
    return "Yes! We are currently celebrating our Grand Opening with a FLAT 30% OFF on all services. You can see the details in the gold banner at the top of our homepage.";
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good evening')) {
    return "Hello! Welcome to Eirene Salon. I am your virtual assistant. How can I help you today? You can ask about our services, current offers, or how to book an appointment.";
  }

  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('okay') || msg.includes('ok')) {
    return "You're welcome! We look forward to seeing you at Eirene Salon. Is there anything else I can help you with?";
  }
  
  if (msg.includes('nails') || msg.includes('manicure') || msg.includes('pedicure')) {
    return "Yes! We offer premium nail services including Gel Extensions, Nail Art, and luxury Manicures. Our experts use high-end products for the best results.";
  }

  if (msg.includes('academy') || msg.includes('course') || msg.includes('learn')) {
    return "Eirene Academy offers professional courses in Hair Styling and Grooming. It's a great way to start your career in the beauty industry. Please contact us at 7087726684 for enrollment details.";
  }

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('number')) {
    return "You can reach us at 7087726684 or 7986098228. We are always happy to help!";
  }

  // Default response
  return "I'm not quite sure about that, but I can help you with bookings, pricing, our location in Bikaner, or our current 30% OFF offer. You can also call us directly at 7087726684 for specific details!";
}
