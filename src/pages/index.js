import * as React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import YouTubeHero from "../components/YouTubeHero"
import {
  Typography,
  Box,
  Container,
  Grid,
  Link,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material"
import TwitterIcon from "@mui/icons-material/Twitter"
import FacebookIcon from "@mui/icons-material/Facebook"

// SEOコンポーネント
const Seo = ({ title, description, image }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
)

// アプリのリスト（実際のデータに置き換えてください）
const apps = [
  {
    title: "ピアノあそび",
    icon: "/images/icon_pianoasobi.png",
    description:
      "どこをタッチしても正解の音が出るので絶対に間違えず、0才からでも楽しくピアノがひけるアプリです。",
  },
  {
    title: "ソングブック",
    icon: "/images/icon_songbook.png",
    description:
      "ジャズ・ポップス、童謡などのスタンダート楽曲の楽譜を2000曲以上収録！全曲移調可能",
  },
  {
    title: "メロディ",
    icon: "/images/icon_melody.png",
    description:
      "ピアノでJ-POPが演奏できるアプリ。落ちてくるボールに合わせてボールをタップするだけ！",
  },
  {
    title: "リズムあそび",
    icon: "/images/icon_rhythmasobi.png",
    description:
      "落ちてくる楽器を音楽に合わせてタップするだけ！楽しくあそびながらリズム感を育てられます。",
  },
]

// YouTubeビデオのリスト（実際のデータに置き換えてください）
const youtubeVideos = [
  { videoId: "NGQeiAIIBng" },
  { videoId: "mf0p0TTOVuA" },
  { videoId: "6-GNhXMREck" },
  { videoId: "vXNWCKwZHg4" },
  { videoId: "1YuEkZuV0ng" },
  { videoId: "4DKr46fzFHg" },
]

const IndexPage = () => (
  <Layout>
    <Seo
      title="堀江 良 - 音楽アプリ開発者・株式会社GENIT代表"
      description="株式会社GENIT代表 堀江 良のプロフィールサイトです。音楽アプリ開発者・ジャズミュージシャン。"
      image="/images/ogp.jpg" // OGP画像のパスを指定してください
    />
    <Box>
      <YouTubeHero videoId="oER4EpHfKws" />
      {/* プロフィールセクション */}
      <Box sx={{ bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.5rem", md: "1.75rem" },
                fontWeight: "bold",
                color: "text.primary",
                mb: 2,
              }}
            >
              堀江 良
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                fontWeight: "medium",
                color: "text.secondary",
                mb: 2,
              }}
            >
              音楽アプリ開発者・株式会社GENIT代表
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                color: "text.secondary",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              神戸でスマホアプリの会社を経営。個人開発から起業。音大(ジャズ)卒。子供向け・ミュージシャン向けの音楽アプリを中心に開発。好きなプログラミング用語は「ポリモーフィズム」。
            </Typography>
          </Box>
        </Container>
      </Box>
      {/* アプリセクション */}
      <Box sx={{ bgcolor: "grey.100" }}>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Typography variant="h2" sx={{ mb: 3, fontSize: "1.5rem" }}>
              株式会社GENIT代表
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                color: "text.secondary",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              子供向けの音楽教育アプリやミュージシャン向けの音楽アプリを提供しています。
            </Typography>
            <Grid container spacing={3}>
              {apps.map((app, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 80,
                        height: 80,
                        margin: "16px auto 0",
                        borderRadius: "12px",
                      }}
                      image={app.icon}
                      alt={app.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center" }}
                      >
                        {app.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {app.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Link
                href="https://www.genit.jp/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#1976d2",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                もっと見る
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* YouTube動画セクション */}
      <Box sx={{ bgcolor: "background.paper" }}>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Typography variant="h2" sx={{ mb: 3, fontSize: "1.5rem" }}>
              演奏動画
            </Typography>
            <Grid container spacing={2}>
              {youtubeVideos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <iframe
                      width="100%"
                      height="auto"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={`YouTube video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ aspectRatio: "16 / 9" }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Link
                href="https://www.youtube.com/channel/UCHlwtjvxbWa4rihfwIAl06Q"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#1976d2",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                もっと見る
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* SNSリンクセクション */}
      <Box sx={{ bgcolor: "grey.100" }}>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <Typography variant="h2" sx={{ mb: 3, fontSize: "1.5rem" }}>
              SNS
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              <Link
                href="https://twitter.com/ryohorie3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon sx={{ fontSize: 40, color: "#1DA1F2" }} />
              </Link>
              <Link
                href="https://www.facebook.com/ryo.horie5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon sx={{ fontSize: 40, color: "#4267B2" }} />
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* フッター */}
      <Box
        sx={{
          bgcolor: "background.paper",
          color: "text.secondary",
          py: 3,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} 堀江 良 / GENIT. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  </Layout>
)

export default IndexPage
