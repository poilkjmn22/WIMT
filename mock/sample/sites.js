const sites = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { siteNo: '北京1', siteName: '房山祖村ZL', line: '京广线' },
      geometry: { type: 'Point', coordinates: [116.0739, 39.57913] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河北1', siteName: '岔河集', line: '京广线' },
      geometry: { type: 'Point', coordinates: [116.2977, 39.10341] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河北2', siteName: '安平西大良', line: '京广线' },
      geometry: { type: 'Point', coordinates: [115.4727, 38.24851] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河北3', siteName: '广宗孔家庄', line: '京广线' },
      geometry: { type: 'Point', coordinates: [115.1931, 37.21831] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河北4', siteName: '郭仕望', line: '京广线' },
      geometry: { type: 'Point', coordinates: [114.8728, 36.3168] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河南1', siteName: '滑县范寨村', line: '京广线' },
      geometry: { type: 'Point', coordinates: [114.7548, 35.42649] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河南2', siteName: '克老马', line: '京广线' },
      geometry: { type: 'Point', coordinates: [114.2096, 34.36195] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '河南3', siteName: '上蔡坡张', line: '京广线' },
      geometry: { type: 'Point', coordinates: [114.6599, 33.23325] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '河南4',
        siteName: '信阳平桥明港马楼',
        line: '京广线'
      },
      geometry: { type: 'Point', coordinates: [113.9139, 32.56417] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '河南5',
        siteName: '信阳罗山山店山店村',
        line: '京广线'
      },
      geometry: { type: 'Point', coordinates: [114.4269, 31.76806] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖北1', siteName: '孝南卧龙福利院', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.8667, 30.9379] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖北2', siteName: '赤壁柳山湖', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.6831, 29.83115] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖北3', siteName: '浠水团陂大屋', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [115.2755, 30.73048] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖北3',
        siteName: 'S_江夏孙家店-EFH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [114.4267, 30.29504] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖北4', siteName: '潜江莫沟', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [112.7788, 30.38569] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖北5', siteName: 'F_枝江草台-HLH', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [111.6865, 30.44898] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖北6',
        siteName: 'G_五峰联通大岩屋-HFH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [110.546, 30.31464] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖北7',
        siteName: 'D_恩施天蒜园-HLH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [109.399, 30.2831] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖北8',
        siteName: 'G_利川忠路太平村1组-HFH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [108.5543, 30.00488] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖南1',
        siteName: '岳阳平江城关迎瑞',
        line: '京广线'
      },
      geometry: { type: 'Point', coordinates: [113.5483, 28.74604] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖南2', siteName: '株洲醴陵障仙岭', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.465, 27.81527] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '湖南3',
        siteName: '株洲茶陵彩霞村(华里村部拉远)',
        line: '京广线'
      },
      geometry: { type: 'Point', coordinates: [113.7891, 26.60921] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '湖南4', siteName: '郴州桂东青山', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.7113, 25.90699] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '广东1', siteName: '韶关高廉', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.4797, 24.95568] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '广东2', siteName: '清远佛冈暖水', line: '京广线' },
      geometry: { type: 'Point', coordinates: [113.4677, 23.7873] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '江苏1',
        siteName: '昆山支浦二铁塔资源点宏站',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [120.972, 31.28851] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '江苏2', siteName: '河失东赵', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [120.177, 32.183] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '江苏3', siteName: '雪堰南山西', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [120.0829, 31.50112] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '江苏4', siteName: '贾张村', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [119.029, 31.49854] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '安徽1', siteName: '颜岗', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [117.9642, 31.43985] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '安徽2',
        siteName: 'LUA-六安新塘村-HZL',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [116.7875, 31.49566] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '安徽3',
        siteName: 'LUA-霍山良山铺-HZL',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [116.1334, 31.27959] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '重庆1', siteName: '武隆徐家', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [107.8622, 29.4997] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '重庆2', siteName: '长寿新滩', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [107.2164, 30.05253] }
    },
    {
      type: 'Feature',
      properties: { siteNo: '重庆3', siteName: '涪陵宅平水站', line: '沪蓉线' },
      geometry: { type: 'Point', coordinates: [107.023, 29.53231] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '四川1',
        siteName: '广安武胜新学乡（广安武胜新学乡新坝村）LY900-ZFH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [106.17, 30.31881] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '四川2',
        siteName: '遂宁大英九间房子900-EFH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [105.2212, 30.51318] }
    },
    {
      type: 'Feature',
      properties: {
        siteNo: '四川3',
        siteName: '简阳市付夕坪900-HLH',
        line: '沪蓉线'
      },
      geometry: { type: 'Point', coordinates: [104.2427, 30.41339] }
    }
  ]
}

export { sites }
