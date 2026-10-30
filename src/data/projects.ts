export const projects = [
  {
    image: 'sheer-room', title: 'A softer kind of daylight', type: 'Pleated sheers & drapes',
    alt: 'Floor-to-ceiling white sheers and soft grey pleated drapes around a corner window above a wooden floor.',
    source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DR54aqXEzAU/',
    width: 1200, height: 1200,
  },
  {
    image: 'layered-room', title: 'A room, beautifully framed', type: 'Layered blackout & sheer curtains',
    alt: 'Taupe pleated drapes with matching tiebacks and white sheers framing a living-room window.',
    source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DbUmwycSXv3/',
    width: 1013, height: 1351,
  },
  {
    image: 'classic-room', title: 'The art of a finishing touch', type: 'Classic swag curtains',
    alt: 'Cream swag curtains with green trim, tassels and layered sheers behind an upholstered living-room sofa.',
    source: 'https://www.instagram.com/mac2din2houseofcurtain/p/CcdKmJ-PC6N/',
    width: 1440, height: 1081,
  },
  {
    image: 'tall-room', title: 'Made for a grand entrance', type: 'Double-height drapes & sheers',
    alt: 'Tall muted green drapes and white sheers in a double-height living room with a chandelier and Christmas tree.',
    source: 'https://www.instagram.com/mac2din2houseofcurtain/p/CT5amyzh3MI/',
    width: 1440, height: 1800,
  },
  {
    image: 'blinds-room', title: 'Light, on your terms', type: 'Korean blinds',
    alt: 'White and grey alternating sheer and solid Korean blinds across several windows in a light living room.',
    source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DQ9FKxakwFv/',
    width: 1440, height: 1440,
  },
];

export const imageSet = (image: string) => [480, 960, 1440]
  .map(width => `/images/${image}-${width}.webp ${width}w`).join(', ');
