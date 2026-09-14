// Built-in content for the static/footer pages.
// Storefront pages render these unless the admin has customized the same
// block via Admin → Pages → (page) → Page Data. Shapes match exactly what
// the admin editor stores in pageContent[slug].data.

export const pageDataDefaults = {
  shipping: {
    methods: [
      { name: 'Standard Shipping', time: '5–7 business days', price: 'Free on orders over $100', desc: 'Our standard shipping option delivers your order within 5-7 business days. Available for all U.S. addresses.' },
      { name: 'Express Shipping', time: '2–3 business days', price: '$15 flat rate', desc: 'Need it faster? Express shipping gets your order to you in just 2-3 business days.' },
    ],
    policies: [
      { title: 'Order Processing', items: ['Orders placed before 2PM EST are processed the same business day.', 'Orders placed after 2PM EST or on weekends are processed the next business day.', "You'll receive an email confirmation immediately after placing your order."] },
      { title: 'Shipping Restrictions', items: ['We currently ship to all 50 U.S. states and territories.', 'P.O. Boxes are accepted for standard shipping only.', 'Some remote areas may experience slightly longer delivery times.'] },
      { title: 'Order Tracking', items: ['Tracking information is sent via email once your order ships.', 'Track your order anytime from your account dashboard.', 'Our carrier partners include UPS, FedEx, and USPS.'] },
    ],
  },

  returns: {
    steps: [
      { title: 'Initiate Your Return', desc: 'Log into your account, go to "My Orders", and select the item you want to return. Or contact our support team.' },
      { title: 'Pack & Ship', desc: 'Print your prepaid shipping label, pack the item in its original packaging, and drop it off at the nearest carrier location.' },
      { title: 'Get Your Refund', desc: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days to your original payment method.' },
    ],
    policy: [
      'Items must be returned within 30 days of delivery.',
      'Items must be unworn, unwashed, and in original packaging with all tags attached.',
      'Free return shipping is provided for all U.S. orders.',
      'Refunds are processed to the original payment method within 5-7 business days.',
      'Exchanges are available for different sizes of the same item.',
      'Final sale items marked as "Clearance" cannot be returned.',
    ],
  },

  'size-guide': {
    tips: [
      'Stand on a piece of paper and trace the outline of your foot.',
      'Measure the length from heel to the tip of your longest toe in centimeters.',
      'Use that measurement to find your size in the chart below.',
      "If you're between sizes, we recommend going half a size up.",
    ],
    charts: [
      { name: 'Men', headers: ['US', 'EU', 'UK', 'CM'], rows: [['7', '40', '6', '25'], ['8', '41', '7', '26'], ['8.5', '42', '7.5', '26.5'], ['9', '42.5', '8', '27'], ['10', '44', '9', '28'], ['11', '45', '10', '29'], ['12', '46', '11', '30'], ['13', '47.5', '12', '31'], ['14', '48.5', '13', '32']] },
      { name: 'Women', headers: ['US', 'EU', 'UK', 'CM'], rows: [['5', '35.5', '2.5', '22'], ['6', '36.5', '3.5', '23'], ['7', '38', '4.5', '24'], ['8', '39', '5.5', '25'], ['9', '40', '6.5', '26'], ['10', '41', '7.5', '27'], ['11', '42.5', '8.5', '28']] },
      { name: 'Kids', headers: ['Size', 'US', 'EU', 'CM'], rows: [['0yr', '1', '16', '8.5'], ['1yr', '2', '17.5', '9.5'], ['2yr', '3', '19', '10.5'], ['3yr', '4', '20', '11.5'], ['4yr', '5', '21.5', '12.5'], ['5yr', '6', '22.5', '13.5'], ['6yr', '7', '24', '14.5'], ['7yr', '8', '25.5', '15.5']] },
    ],
  },

  about: {
    values: [
      { title: 'Innovation', desc: 'We push boundaries in design and technology to create products that redefine what footwear can be.' },
      { title: 'Quality', desc: 'Every product is crafted with premium materials and rigorous testing to ensure it meets the highest standards.' },
      { title: 'Community', desc: 'We believe in the power of sport to bring people together and create positive change in communities worldwide.' },
      { title: 'Sustainability', desc: 'We are committed to protecting the planet through sustainable practices and eco-friendly materials.' },
    ],
    stats: [
      { number: '500+', label: 'Products' },
      { number: '50K+', label: 'Happy Customers' },
      { number: '100%', label: 'Authentic' },
      { number: '4.8★', label: 'Average Rating' },
    ],
    mission: "To make the world's best footwear accessible to everyone, while building a community that celebrates style, performance, and self-expression.",
  },

  sustainability: {
    initiatives: [
      { title: 'Eco-Friendly Materials', desc: 'We prioritize products made with recycled and sustainable materials, reducing our reliance on virgin resources.', stat: '40%', statLabel: 'recycled materials' },
      { title: 'Carbon Neutral Shipping', desc: 'Every shipment is carbon-offset through verified environmental projects, making your delivery impact-neutral.', stat: '100%', statLabel: 'carbon offset' },
      { title: 'Minimal Packaging', desc: 'We use 100% recyclable packaging and have eliminated single-use plastics from our supply chain.', stat: '0', statLabel: 'single-use plastic' },
      { title: 'Giving Back', desc: 'We donate 2% of every sale to environmental nonprofits working to protect our planet for future generations.', stat: '2%', statLabel: 'donated per sale' },
    ],
    goals: [
      'Achieve 100% recycled or renewable materials by 2027.',
      'Reduce packaging waste by 50% by end of 2026.',
      'Plant 10,000 trees through our reforestation partners.',
      'Achieve net-zero carbon emissions across all operations.',
    ],
  },

  news: {
    articles: [
      { date: 'Aug 28, 2026', category: 'Product Launch', title: 'Introducing the Nike Air Max Pulse — Available Now', excerpt: 'The Air Max Pulse brings visible Air technology to a new generation. Inspired by the London music scene, it delivers energy and style in every step.', featured: true },
      { date: 'Aug 20, 2026', category: 'Collection', title: "Back to School: The Best Kids' Sneakers for 2026", excerpt: 'From the court to the classroom, check out our top picks for the new school year. Durable, stylish, and ready for anything.', featured: false },
      { date: 'Aug 15, 2026', category: 'Sustainability', title: 'Our Journey to Zero Waste: Mid-Year Update', excerpt: "We're on track to reduce packaging waste by 50%. Here's a look at what we've accomplished so far and what's next.", featured: false },
      { date: 'Aug 10, 2026', category: 'Community', title: 'Vére x Local Artists: Sneaker Customization Event', excerpt: 'We partnered with local artists for an exclusive sneaker customization workshop. See the amazing one-of-a-kind designs that were created.', featured: false },
      { date: 'Aug 5, 2026', category: 'Product Launch', title: 'Jordan 6 Rings — Now Available in New Colorways', excerpt: 'The iconic Jordan 6 Rings returns with fresh colorways. Six championship rings, one bold silhouette.', featured: false },
      { date: 'Jul 28, 2026', category: 'Style Guide', title: 'Summer to Fall: How to Transition Your Sneaker Rotation', excerpt: "The seasons are changing, but your sneaker game doesn't have to. Our guide to keeping it fresh from August to October.", featured: false },
    ],
  },

  careers: {
    values: [
      { title: 'Obsess Over Craft', desc: 'We sweat the details — from the stitch on a shoe to the pixel on screen. Quality is not negotiable.' },
      { title: 'Move Fast, Stay Sharp', desc: 'We ship quickly, learn from results, and iterate. Speed and quality are partners, not opposites.' },
      { title: 'Own Your Impact', desc: "Every role here matters. You'll see your work shape real products, real revenue, and real customer experiences." },
      { title: 'Better Together', desc: 'Collaboration is our superpower. We share knowledge, challenge assumptions, and celebrate wins as a team.' },
    ],
    perks: [
      { title: 'Remote-First Culture', desc: 'Work from anywhere. We trust you to deliver your best work wherever you are most productive.' },
      { title: 'Competitive Compensation', desc: 'Top-of-market salary, equity options, and annual performance bonuses that reward your contributions.' },
      { title: 'Health & Wellness', desc: 'Full medical, dental, vision, and mental health coverage for you and your dependents.' },
      { title: 'Product Access', desc: 'Up to 50% employee discount on all products, plus early access to limited-edition releases.' },
      { title: 'Growth Budget', desc: '$2,500 annual stipend for courses, conferences, books, and tools to accelerate your career.' },
      { title: 'Flexible Time Off', desc: 'Generous PTO policy with a minimum 3-week recommendation, plus 4 wellness days and company holidays.' },
    ],
    testimonials: [
      { name: 'Sarah Chen', role: 'Senior Engineer', years: '2 years', quote: "The engineering culture here is unlike anywhere I've worked. We ship fast, but we never cut corners. Every sprint I'm solving real problems that impact real customers." },
      { name: 'Marcus Williams', role: 'Brand Designer', years: '1.5 years', quote: "Creative freedom at Vére is genuine. I pitched a completely new visual direction for our homepage and it shipped within two weeks. That's how fast things move here." },
      { name: 'Priya Sharma', role: 'Product Manager', years: '3 years', quote: "What sets Vére apart is the people. Everyone is deeply passionate about what they build, and there's a real sense of ownership across every team." },
    ],
  },
};

/* Field schemas driving the admin "Page Data" editor */
export const PAGE_SCHEMAS = {
  shipping: [
    {
      key: 'methods', label: 'Shipping Methods', fields: [
        { name: 'name', label: 'Method Name', type: 'text' },
        { name: 'time', label: 'Delivery Time', type: 'text' },
        { name: 'price', label: 'Price Label', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'policies', label: 'Policy Groups', fields: [
        { name: 'title', label: 'Group Title', type: 'text' },
        { name: 'items', label: 'Bullet Points (one per line)', type: 'lines' },
      ],
    },
  ],
  returns: [
    {
      key: 'steps', label: 'How It Works — Steps', fields: [
        { name: 'title', label: 'Step Title', type: 'text' },
        { name: 'desc', label: 'Step Description', type: 'textarea' },
      ],
    },
    { key: 'policy', label: 'Return Policy Bullets', type: 'lines' },
  ],
  'size-guide': [
    { key: 'tips', label: 'How to Measure — Tips', type: 'lines' },
    {
      key: 'charts', label: 'Size Charts', fields: [
        { name: 'name', label: 'Chart Name (tab)', type: 'text' },
        { name: 'headers', label: 'Column Headers (comma separated)', type: 'csv' },
        { name: 'rows', label: 'Rows (one per line, comma separated)', type: 'lines', csvLines: true },
      ],
    },
  ],
  about: [
    {
      key: 'values', label: 'Our Values', fields: [
        { name: 'title', label: 'Value Title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'stats', label: 'Stats', fields: [
        { name: 'number', label: 'Number (e.g. 500+)', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' },
      ],
    },
    { key: 'mission', label: 'Mission Statement', type: 'single' },
  ],
  sustainability: [
    {
      key: 'initiatives', label: 'Initiatives', fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'stat', label: 'Big Stat (e.g. 40%)', type: 'text' },
        { name: 'statLabel', label: 'Stat Label', type: 'text' },
      ],
    },
    { key: 'goals', label: 'Goals', type: 'lines' },
  ],
  news: [
    {
      key: 'articles', label: 'News Articles', fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'date', label: 'Date (e.g. Aug 28, 2026)', type: 'text' },
        { name: 'featured', label: 'Featured (large card at top)', type: 'check' },
      ],
    },
  ],
  careers: [
    {
      key: 'values', label: 'What We Stand For', fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'perks', label: 'Benefits & Perks', fields: [
        { name: 'title', label: 'Perk Title', type: 'text' },
        { name: 'desc', label: 'Description', type: 'textarea' },
      ],
    },
    {
      key: 'testimonials', label: 'Team Testimonials', fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'years', label: 'Time at Company', type: 'text' },
        { name: 'quote', label: 'Quote', type: 'textarea' },
      ],
    },
  ],
};
