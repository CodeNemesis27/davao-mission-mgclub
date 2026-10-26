/* Member data for the Masterguide Club website.
   This is the only file you edit to add, remove or change members. */

/* ============================================================
   MEMBERS DATA — sample entries. Replace with your real members.
   id: unique, lowercase letters/numbers/hyphens. It is encoded in the
       member's QR code, so keep it fixed once QR codes are printed.
   photo: path to a portrait in the member-images folder, for example
       'member-images/member2.jpg' (leave '' to show a generated
       initials portrait). dob: YYYY-MM-DD.
   ============================================================ */
// Address the QR codes point to. Use the address where this page is hosted.
// Leave '' to use the address of the page the visitor is on.
var SITE_URL = '';

var MEMBERS = [
  {
    id: 'maria-villanueva',
    name: 'Maria Lourdes Villanueva',
    role: 'Club Director',
    dob: '1984-03-12',
    photo: 'member-images/member1.png',
    address: 'Purok 4, Brgy. Matina Crossing, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Directed the Mission-wide Pathfinder Camporee program committee',
      'Trained more than 40 new Pathfinder staff members',
      'Organized an annual community feeding program with partner churches'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2016 },
      { title: 'Advanced Pathfinder Staff Training', issuer: 'Davao Mission Youth Ministries', year: 2018 },
      { title: 'Basic Life Support', issuer: 'Accredited training provider', year: 2024 }
    ]
  },
  {
    id: 'jerome-delacruz',
    name: 'Jerome Andres Dela Cruz',
    role: 'Associate Director',
    dob: '1979-08-27',
    photo: 'member-images/member2.jpg',
    address: 'Purok 12, Brgy. Buhangin Proper, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Led the Mission delegation to three regional camporees',
      'Mentored five club directors in their first year',
      'Honors instructor: Camping Skills and Knot Tying'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2014 },
      { title: 'Camporee Program Leadership', issuer: 'Davao Mission Youth Ministries', year: 2019 }
    ]
  },
  {
    id: 'rosalinda-cabahug', name: 'Rosalinda Mae Cabahug', role: 'Secretary', dob: '1988-11-05', photo: 'member-images/member3.jpg',
    address: 'Purok 7, Brgy. Toril Poblacion, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Built the club’s member records and attendance system',
      'Coordinated registration for 300 campers at the district camporee',
      'Volunteer first-aid responder at club outings'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2020 },
      { title: 'Standard First Aid', issuer: 'Accredited training provider', year: 2023 },
      { title: 'Pathfinder Staff Training Award', issuer: 'Davao Mission Youth Ministries', year: 2017 }
    ]
  },
  {
    id: 'nathaniel-bautista', name: 'Nathaniel Joseph Bautista', role: 'Camp Coordinator', dob: '1991-01-19', photo: 'member-images/member4.jpg',
    address: 'Purok 3, Brgy. Talomo Proper, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Planned and ran twelve overnight campouts',
      'Designed the Mission’s map and compass training course',
      'Honors instructor: Orienteering and Fire Building'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2021 },
      { title: 'Advanced Camping Skills Honor', issuer: 'Davao Mission Youth Ministries', year: 2019 }
    ]
  },
  {
    id: 'evangeline-ramos', name: 'Evangeline Grace Ramos', role: 'Training Officer', dob: '1976-06-30', photo: 'member-images/member5.jpg',
    address: 'Purok 9, Brgy. Panacan, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Wrote the club’s new-staff orientation guide',
      'Led staff training workshops in six local churches',
      'Recognized for twenty years of continuous club service'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2008 },
      { title: 'Advanced Pathfinder Staff Training', issuer: 'Davao Mission Youth Ministries', year: 2012 },
      { title: 'Facilitator Skills Workshop', issuer: 'Accredited training provider', year: 2021 }
    ]
  },
  {
    id: 'caleb-tan', name: 'Caleb Emmanuel Tan', role: 'Honors Instructor', dob: '1994-09-14', photo: 'member-images/member6.jpg',
    address: 'Purok 2, Brgy. Lanang, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Taught more than 200 youth through the honors program',
      'Introduced a hands-on nature honors series',
      'Honors instructor: Birds, Trees and Basic Survival'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2022 },
      { title: 'Nature Honors Instructor Credential', issuer: 'Davao Mission Youth Ministries', year: 2022 }
    ]
  },
  {
    id: 'ruth-pacatang', name: 'Ruth Angelica Pacatang', role: 'Community Service Lead', dob: '1986-04-22', photo: 'member-images/member7.jpg',
    address: 'Purok 6, Brgy. Catalunan Grande, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Led clean-up drives in four Davao barangays',
      'Coordinated club volunteers for relief packing after local floods',
      'Started a school-supplies drive for Pathfinder families'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2018 },
      { title: 'Community Disaster Response Basics', issuer: 'Accredited training provider', year: 2022 },
      { title: 'Basic Life Support', issuer: 'Accredited training provider', year: 2025 }
    ]
  },
  {
    id: 'samuel-ocampo', name: 'Samuel David Ocampo', role: 'Treasurer', dob: '1982-12-02', photo: 'member-images/member8.png',
    address: 'Purok 11, Brgy. Mintal, Davao City 8000',
    achievements: [
      'Master Guide Investiture',
      'Kept clear, audited club accounts for six straight years',
      'Raised funds for twenty camporee scholarships',
      'Honors instructor: Stewardship and Basic Carpentry'
    ],
    certificates: [
      { title: 'Master Guide Certificate', issuer: 'Davao Mission Youth Ministries', year: 2015 },
      { title: 'Church Treasury Management', issuer: 'Accredited training provider', year: 2019 }
    ]
  }
];
