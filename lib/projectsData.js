// Unified Projects Data
// Single source of truth for all project information across the application

export const projectsData = [
    {
      id: 1,
      name: 'King Salman Medical City',
      title: 'KSMC Medical Finishing Works',
      location: 'Riyadh, KSA',
      year: 2024,
      category: 'medical',
      categoryDisplay: 'Medical Finishing',
      description: 'Execution of interior finishing for the surgical wing. Scope included installation of anti-static vinyl flooring, wall protection systems, and supervision of medical gas piping installation.',
      images: [
        'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Construction worker installing ventilation/ceiling
        'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Engineer holding blueprints on site
        'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Worker fixing ceiling panels/lights
      ],
      featured: true,
      slug: 'ksmc-medical-finishing'
    },
    {
      id: 2,
      name: 'Riyadh Industrial Cooling Plant',
      title: 'District Cooling MEP',
      location: 'Riyadh, KSA',
      year: 2023,
      category: 'mep',
      categoryDisplay: 'MEP',
      description: 'Heavy mechanical works including welding of large diameter chilled water pipes, installation of industrial pumps, and vibration isolation systems.',
      images: [
        'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Industrial piping close up
        'https://images.pexels.com/photos/2381463/pexels-photo-2381463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Worker welding/grinding metal
        'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Engineer inspecting pressure gauges
      ],
      featured: true,
      slug: 'riyadh-industrial-cooling'
    },
    {
      id: 3,
      name: 'Al Khobar Specialist Clinic',
      title: 'Clinic Interior Fit-out',
      location: 'Al Khobar, KSA',
      year: 2024,
      category: 'medical',
      categoryDisplay: 'Medical Finishing',
      description: 'Turnkey interior finishing. Our teams handled the drywall partitioning, painting of sterile areas, and installation of hermetically sealed doors.',
      images: [
        'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Workers painting/finishing walls
        'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Construction site interior team
        'https://images.pexels.com/photos/7218525/pexels-photo-7218525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Installing electrical fixtures
      ],
      featured: true,
      slug: 'al-khobar-specialist-clinic'
    },
    {
      id: 4,
      name: 'Jeddah Commercial Tower MEP',
      title: 'High-Rise Electrical & HVAC',
      location: 'Jeddah, KSA',
      year: 2023,
      category: 'mep',
      categoryDisplay: 'MEP',
      description: 'Complex electrical wiring for 40 floors. Installation of cable trays, main distribution boards (MDBs), and fire alarm systems integration.',
      images: [
        'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Complex ceiling pipes and wires
        'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Electrical switchgear/wiring
      ],
      featured: true,
      slug: 'jeddah-commercial-tower-mep'
    },
    {
      id: 5,
      name: 'Dammam Pharma Warehouse',
      title: 'HVAC Ducting Systems',
      location: 'Dammam, KSA',
      year: 2024,
      category: 'mep',
      categoryDisplay: 'MEP',
      description: 'Fabrication and installation of galvanized steel ductwork for climate control. Included commissioning of heavy-duty ventilation fans and HEPA filters.',
      images: [
        'https://images.pexels.com/photos/585418/pexels-photo-585418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Engineer checking industrial equipment
        'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Ventilation fan/Industrial AC
              ],
      featured: false,
      slug: 'dammam-pharma-warehouse'
    },
    {
      id: 6,
      name: 'Royal Commission Hospital',
      title: 'ICU Renovation Works',
      location: 'Jubail, KSA',
      year: 2025,
      category: 'medical',
      categoryDisplay: 'Medical Finishing',
      description: 'Renovation site management. Demolition of old interiors and installation of new medical-grade ceiling grids and copper pipes for oxygen supply.',
      images: [
        'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Team looking at plans on table
        'https://images.pexels.com/photos/8961403/pexels-photo-8961403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Technician with tools/drill
        'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Construction site raw interior
      ],
      featured: true,
      slug: 'royal-commission-hospital-icu'
    },
  ];
  
  // Helper function to get featured projects only
  export const getFeaturedProjects = () => {
    return projectsData.filter(project => project.featured === true);
  };
  
  // Helper function to get project by ID
  export const getProjectById = (id) => {
    return projectsData.find(project => project.id === parseInt(id));
  };
  
  // Helper function to get projects by category
  export const getProjectsByCategory = (category) => {
    if (category === 'all') {
      return projectsData;
    }
    return projectsData.filter(project => project.category === category);
  };
  
  // Available categories for filtering
  export const categories = ['all', 'mep', 'medical'];
  
  // Display categories (capitalized)
  export const displayCategories = ['All', 'MEP Works', 'Medical Finishing'];