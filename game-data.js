export const COLORS = [
  { id: 'red', name: 'الحمراء', label: 'أحمر', hex: '#ff8176', audio: 'color_red' },
  { id: 'blue', name: 'الزرقاء', label: 'أزرق', hex: '#70cfe9', audio: 'color_blue' },
  { id: 'yellow', name: 'الصفراء', label: 'أصفر', hex: '#ffd867', audio: 'color_yellow' },
  { id: 'green', name: 'الخضراء', label: 'أخضر', hex: '#79c96c', audio: 'color_green' },
  { id: 'purple', name: 'البنفسجية', label: 'بنفسجي', hex: '#ad92e8', audio: 'color_purple' },
  { id: 'pink', name: 'الوردية', label: 'وردي', hex: '#ff9fc4', audio: 'color_pink' }
];

export const SHAPES = [
  { id: 'circle', name: 'الدائرة', audio: 'shape_circle' },
  { id: 'square', name: 'المربع', audio: 'shape_square' },
  { id: 'triangle', name: 'المثلث', audio: 'shape_triangle' },
  { id: 'star', name: 'النجمة', audio: 'shape_star' },
  { id: 'heart', name: 'القلب', audio: 'shape_heart' }
];

export const NUMBERS = [1, 2, 3, 4, 5].map(n => ({
  id: String(n),
  value: n,
  name: ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة'][n],
  audio: `number_${n}`
}));

export const ALL_ANIMALS = [
  ['lion', 'الأسد'], ['elephant', 'الفيل'], ['monkey', 'القرد'],
  ['giraffe', 'الزرافة'], ['panda', 'الباندا'], ['frog', 'الضفدع'],
  ['tiger', 'النمر'], ['zebra', 'الحمار الوحشي'], ['hippo', 'فرس النهر'],
  ['rabbit', 'الأرنب'], ['cow', 'البقرة'], ['horse', 'الحصان'],
  ['duck', 'البطة'], ['cat', 'القطة'], ['fish', 'السمكة'],
  ['turtle', 'السلحفاة'], ['dolphin', 'الدلفين'], ['octopus', 'الأخطبوط'],
  ['crab', 'السلطعون'], ['whale', 'الحوت'], ['shark', 'القرش']
].map(([id, name]) => ({ id, name, audio: `animal_${id}` }));

const byId = id => ALL_ANIMALS.find(animal => animal.id === id);

export const WORLDS = {
  jungle: {
    name: 'الغابة', art: 'jungle', className: 'world-jungle',
    animals: ['lion','elephant','monkey','giraffe','panda','frog','tiger','zebra','hippo','rabbit'].map(byId),
    youngTypes: ['animal','color','size','match'],
    olderTypes: ['animal','color','number','shape','size','match','odd']
  },
  farm: {
    name: 'المزرعة', art: 'farm', className: 'world-farm',
    animals: ['cow','horse','duck','cat','rabbit'].map(byId),
    youngTypes: ['animal','color','size','match'],
    olderTypes: ['animal','color','number','shape','size','match','odd']
  },
  ocean: {
    name: 'البحر', art: 'ocean', className: 'world-ocean',
    animals: ['fish','turtle','dolphin','octopus','crab','whale','shark'].map(byId),
    youngTypes: ['animal','color','size','match'],
    olderTypes: ['animal','color','number','shape','size','match','odd']
  },
  bubblecity: {
    name: 'مدينة الفقاعات', art: 'bubblecity', className: 'world-bubblecity', animals: [],
    youngTypes: ['color','shape','size','match'],
    olderTypes: ['color','shape','number','size','match','odd']
  }
};

export const FEEDBACK = [
  { title: 'رائع!', sub: 'وجدتها', audio: 'feedback_great' },
  { title: 'أحسنت!', sub: 'إجابة جميلة', audio: 'feedback_welldone' },
  { title: 'ممتاز!', sub: 'استمر يا بطل', audio: 'feedback_excellent' },
  { title: 'واو!', sub: 'أنت رائع', audio: 'feedback_wow' },
  { title: 'جميل جدًا!', sub: 'أكمل المغامرة', audio: 'feedback_keepgoing' }
];
