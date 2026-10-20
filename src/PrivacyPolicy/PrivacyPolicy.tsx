import { useEffect } from "react";
// import { useLocation } from "react-router";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { PrivacyPolicyFooter } from "./PrivacyPolicyFooter";

export default function PrivacyPolicy() {
  // title
  const title = "プライバシーポリシー - noreta.net";

  const description = "このサイト、サービスのプライバシーポリシーについて記述します";
  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", description);

  // const location = useLocation();

  useEffect(() => {
    // GA4
    window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <main>
        <Typography component="h1" variant="h5" sx={{ m: 2 }}>
          プライバシーポリシー
        </Typography>
        <Typography sx={{ m: 2 }}>
          本サービスにおいて，以下のとおりプライバシーポリシーを定めます。個人情報を取り扱うにあたっては、
          「個人情報の保護に関する法律」をはじめとする個人情報の保護に関する法令、
          ガイドラインおよび本プライバシーポリシーを遵守いたします。
          また本サービスでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。
          このGoogleアナリティクスはデータの収集のためにCookieを使用しています。
          このデータは匿名で収集されており、個人を特定するものではありません。
          この機能はCookieを無効にすることで収集を拒否することが出来ますので、
          お使いのブラウザの設定をご確認ください。
          この規約に関しての詳細は
          <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/">Googleアナリティクスサービス利用規約のページ</Link>や
          <Link href="https://policies.google.com/technologies/ads?hl=ja">Googleポリシーと規約ページ</Link>をご覧ください。
          {/* また本サービスでは Amazon Pinpoint を用いて使用状況を分析しています。
          Amazon Pinpoint でのデータ使用については
          <Link href="https://aws.amazon.com/jp/pinpoint/data-privacy-compliance-faq/">
            こちら
          </Link>
          をご確認ください。 */}
        </Typography>
        {/* <Typography variant="h6" component="h2" sx={{ m: 2 }}>
          広告の配信について
        </Typography>
        <Typography sx={{ m: 2 }}>
          当サイトは Google 及び Google
          のパートナー（第三者配信事業者）の提供する広告を設置しております。その広告配信には
          Cookie
          を使用し、当サイトやその他のサイトへの過去のアクセス情報に基づいて広告を配信します。
          Google が広告 Cookie
          を使用することにより、当サイトや他のサイトにアクセスした際の情報に基づいて、
          Google やそのパートナーが適切な広告を表示しています。 お客様は Google
          アカウントの広告設定ページ{" "}
          <Link href="https://adssettings.google.com/u/0/authenticated">
            https://adssettings.google.com/u/0/authenticated
          </Link>{" "}
          で、パーソナライズ広告を無効にできます。また aboutads.info
          のページにアクセスして頂き、パーソナライズ広告掲載に使用される第三者配信事業者の
          Cookie を無効にできます。 その他、 Google の広告における Cookie
          の取り扱い詳細については、 Google のポリシーと規約ページ{" "}
          <Link href="https://policies.google.com/technologies/ads">
            https://policies.google.com/technologies/ads
          </Link>{" "}
          をご覧ください。
        </Typography> */}
      </main>
      <PrivacyPolicyFooter />
    </>
  );
}
