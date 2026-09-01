// 常见造岩矿物速查表
const MINERALS = [
  {n:'石英',en:'Quartz',color:'无色、乳白色，含杂质可呈紫、烟灰、玫瑰色',luster:'玻璃光泽',hardness:'7',cleavage:'无解理，贝壳状断口',feature:'硬度大，小刀刻不动；无解理面；是花岗岩、砂岩的主要成分'},
  {n:'钾长石',en:'K-feldspar',color:'肉红色、浅黄色、白色',luster:'玻璃光泽',hardness:'6',cleavage:'两组解理近直交',feature:'常见格子双晶(微斜长石)；花岗岩、正长岩的主要矿物'},
  {n:'斜长石',en:'Plagioclase',color:'白色、灰白色，基性者色深',luster:'玻璃光泽',hardness:'6-6.5',cleavage:'两组解理近直交',feature:'常见聚片双晶(解理面细密条纹)，与钾长石区分标志'},
  {n:'黑云母',en:'Biotite',color:'黑色、褐黑色',luster:'玻璃-珍珠光泽',hardness:'2.5-3',cleavage:'一组极完全解理',feature:'薄片有弹性，可撕成薄片；广泛见于花岗岩、片岩'},
  {n:'白云母',en:'Muscovite',color:'无色、浅黄、银白色',luster:'玻璃-珍珠光泽',hardness:'2-2.5',cleavage:'一组极完全解理',feature:'薄片透明有弹性；千枚岩丝绢光泽的来源'},
  {n:'角闪石',en:'Hornblende',color:'黑色、深绿黑色',luster:'玻璃光泽',hardness:'5-6',cleavage:'两组解理约呈56°/124°',feature:'长柱状晶形，横断面近菱形；闪长岩、安山岩常见矿物'},
  {n:'辉石',en:'Pyroxene',color:'黑绿色、暗绿色',luster:'玻璃光泽',hardness:'5-6',cleavage:'两组解理近直交(约87°)',feature:'短柱状晶形，与角闪石解理夹角区分(直角 vs 斜交)'},
  {n:'橄榄石',en:'Olivine',color:'橄榄绿色、黄绿色',luster:'玻璃光泽',hardness:'6.5-7',cleavage:'解理不完全，贝壳状断口',feature:'粒状晶形，玻璃光泽鲜绿；橄榄岩、玄武岩的特征矿物'},
  {n:'方解石',en:'Calcite',color:'无色、白色，常染色',luster:'玻璃光泽',hardness:'3',cleavage:'三组完全解理成菱面体',feature:'遇稀盐酸剧烈起泡；硬度低，小刀可刻划'},
  {n:'白云石',en:'Dolomite',color:'白色、浅灰色，风化面常显棕黄',luster:'玻璃光泽',hardness:'3.5-4',cleavage:'三组完全解理成菱面体',feature:'仅粉末遇稀盐酸微弱起泡，块状不起泡，以此区别方解石'},
  {n:'石榴子石',en:'Garnet',color:'红色、褐红色、黑色',luster:'玻璃-树脂光泽',hardness:'6.5-7.5',cleavage:'无解理',feature:'常呈菱形十二面体自形晶；片岩、榴辉岩的特征变斑晶'},
  {n:'绿泥石',en:'Chlorite',color:'绿色、暗绿色',luster:'玻璃-珍珠光泽',hardness:'2-2.5',cleavage:'一组完全解理',feature:'薄片具挠性但无弹性(与云母区别)；低级变质岩常见矿物'},
  {n:'滑石',en:'Talc',color:'白色、浅绿色',luster:'珍珠-油脂光泽',hardness:'1',cleavage:'一组完全解理',feature:'摩氏硬度标准矿物(硬度1)，手感滑腻，指甲易刻划'},
  {n:'蛇纹石',en:'Serpentine',color:'黄绿色、暗绿色',luster:'蜡状-油脂光泽',hardness:'2.5-4',cleavage:'致密块状，无明显解理',feature:'蜡状光泽，质地细腻滑腻；蛇纹岩的主要组成矿物'},
  {n:'石膏',en:'Gypsum',color:'无色、白色',luster:'玻璃-珍珠光泽',hardness:'2',cleavage:'一组极完全解理',feature:'硬度极低，指甲可轻易刻划；蒸发岩沉积环境标志矿物'},
  {n:'石盐',en:'Halite',color:'无色、白色，杂质可染色',luster:'玻璃光泽',hardness:'2-2.5',cleavage:'三组完全解理成立方体',feature:'味咸，易溶于水；立方体解理及晶形特征明显'},
  {n:'磷灰石',en:'Apatite',color:'绿色、黄绿色、褐色',luster:'玻璃-油脂光泽',hardness:'5',cleavage:'解理不完全',feature:'摩氏硬度标准矿物(硬度5)；沉积磷块岩的主要矿物'},
  {n:'黄铁矿',en:'Pyrite',color:'浅铜黄色，俗称"愚人金"',luster:'强金属光泽',hardness:'6-6.5',cleavage:'无解理，参差状断口',feature:'立方体晶形常见，条痕绿黑色，硬度较大(可别于黄铜矿)'},
  {n:'磁铁矿',en:'Magnetite',color:'黑色',luster:'半金属光泽',hardness:'5.5-6.5',cleavage:'无解理',feature:'具强磁性，条痕黑色；基性-超基性岩中常见副矿物'},
  {n:'红柱石',en:'Andalusite',color:'灰白色、肉红色',luster:'玻璃光泽',hardness:'6.5-7.5',cleavage:'两组解理近直交',feature:'横断面可见十字形炭质包裹体("空晶石")；接触变质角岩的标志矿物'}
];
