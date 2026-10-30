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

export const approachProject = {
  image: 'stairwell-sheers',
  alt: 'White pleated sheers following tall curved stairwell windows beside an ornamental railing.',
  source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DLpTAy5RTze/',
};

export const detailProjects = [
  { image: 'neutral-bedroom', title: 'Layered for a restful room', type: 'Pleated drapes & sheers', alt: 'Pale pleated drapes tied to each side of white bedroom sheers behind a bed.', source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DQBANWpE4mM/' },
  { image: 'tailored-pleats', title: 'Gathered with care', type: 'Pleats & matching tiebacks', alt: 'Taupe pleated curtains with matching tiebacks over white sheers and a patterned window grille.', source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DJVUkUwSA1A/' },
  { image: 'single-panel', title: 'A tailored finishing touch', type: 'Single-panel curtain', alt: 'A taupe curtain panel gathered into a matching tieback at a tall narrow window.', source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DJVUUZhyMHp/' },
  { image: 'blue-blind', title: 'Control the daylight', type: 'Korean blinds', alt: 'A blue and white alternating sheer and solid Korean blind fitted within a recessed window.', source: 'https://www.instagram.com/mac2din2houseofcurtain/p/DJVRNDxSzDG/' },
];
