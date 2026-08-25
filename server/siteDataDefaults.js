function createDefaultSiteData() {
  return {
    userId: 'tech-bridge',
    design: {
      template: '',
      layout: 'jc-system-corporate',
      primaryColor: '#27779f',
      accentColor: '#4fa7d6',
      font: 'Noto Sans JP',
      style: 'J.C.Systemのような信頼感のある企業サイト構成を参考にする'
    },
    defines: {
      siteLogo: '',
      siteLogoSub: '',
      companyName: 'Tech Bridge株式会社',
      siteName: 'Tech Bridge',
      copyright: 'Copyright © 2026 Tech Bridge Inc. All Rights Reserved.',
      address: '',
      tel: '',
      fax: '',
      email: '',
      officialUrl: 'https://tech-bridge.co.jp'
    },
    top: {
      mainImage: '',
      catchcopy: '日本と世界をつなぐテクノロジーパートナー',
      lead: 'システム開発、Web制作、IT支援を通じて、お客様の事業成長を支えます。',
      aboutTitle: 'Tech Bridgeについて',
      aboutItems: [
        'お客様の課題に寄り添い、最適なITソリューションを提案します。',
        '日本国内と海外リソースを活用し、柔軟な開発体制を構築します。'
      ],
      serviceSummary: 'Webサイト制作、業務システム開発、ITコンサルティングを提供します。',
      productsSummary: '自社サービスや導入実績を分かりやすく紹介します。',
      recruitSummary: '共に成長できるメンバーを募集しています。'
    },
    company: {
      greetingImage: '',
      greetingTitle: 'ご挨拶',
      greetingText: '私たちは、技術と信頼を大切にしながら、お客様のビジネスに貢献する会社を目指しています。',
      representative: '',
      profile: [
        { label: '会社名', value: 'Tech Bridge株式会社' },
        { label: '設立年月日', value: '' },
        { label: '資本金', value: '' },
        { label: '代表者名', value: '' },
        { label: '事業内容', value: 'Webサイト制作、システム開発、ITコンサルティング' },
        { label: '所在地', value: '' }
      ],
      history: [
        { year: '2026年', text: 'Tech Bridge株式会社 設立' }
      ],
      groupCompanies: [],
      achievements: [],
      access: ''
    },
    services: [
      {
        title: 'Webサイト制作',
        description: '企業サイト、LP、採用サイトなど、目的に合わせた静的Webサイトを制作します。',
        image: ''
      },
      {
        title: 'システム開発',
        description: '業務効率化やサービス立ち上げに必要なWebシステムを設計・開発します。',
        image: ''
      }
    ],
    products: [
      {
        title: '導入事例・サービス紹介',
        description: 'お客様の課題解決につながるサービスや事例を紹介します。',
        image: ''
      }
    ],
    careers: {
      message: '新しい価値を一緒に作る仲間を募集しています。',
      jobs: [
        {
          title: 'Webエンジニア',
          location: '',
          salary: '',
          description: 'Webサイト制作、システム開発、運用改善などを担当します。',
          requirements: 'Web開発経験、コミュニケーション能力',
          benefits: ''
        }
      ],
      privacyPolicy: '当サイトは、お客様の個人情報を適切に管理し、目的外利用を行いません。'
    },
    contact: {
      phone: '',
      email: '',
      address: '',
      mapUrl: '',
      description: 'お問い合わせは下記のフォームまたはメールにてご連絡ください。'
    }
  };
}

module.exports = { createDefaultSiteData };
