'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar,
  Link as MuiLink,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import { Globe } from 'lucide-react';
import StyledTypography from '@/app/readers/components/StyledTypography';
import Author from '@/app/readers/components/Author';

const LawFirmContentPage = () => {
  const { lawfirmId } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('articles');

  useEffect(() => {
    const fetchContent = async () => {
        try {
          const profileRes = await axiosInstance.get(`/api/lawfirms/${lawfirmId}`);
          setProfile(profileRes.data);
      
          // Load default tab
          if (tab === 'articles') {
            const articlesRes = await axiosInstance.get(`/api/articles/?author__lawfirm_id=${lawfirmId}`);
            setArticles(articlesRes.data.results || []);
          } else {
            const contractsRes = await axiosInstance.get(`/api/contracts/?lawfirm_id=${lawfirmId}`);
            setContracts(contractsRes.data.results || []);
          }
        } catch (err) {
          console.error('Error fetching law firm profile or content:', err);
        } finally {
          setLoading(false);
        }
    };      

    fetchContent();
  }, [lawfirmId]);

  const handleTabChange = async (event, newValue) => {
    setTab(newValue);
    setLoading(true);
  
    try {
      if (newValue === 'articles') {
        const articlesRes = await axiosInstance.get(`/api/articles/?author__lawfirm_id=${lawfirmId}`);
        setArticles(articlesRes.data.results || []);
      } else {
        const contractsRes = await axiosInstance.get(`/api/contracts/?lawfirm_id=${lawfirmId}`);
        setContracts(contractsRes.data.results || []);
      }
    } catch (err) {
      console.error('Error switching tab:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 20, mb: 6 }}>
      {/* Profile Header */}
      {profile && (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar
            src={profile.logo || profile.user?.profile_picture || undefined}
            alt={profile.name}
            sx={{
              width: 96,
              height: 96,
              mx: 'auto',
              mb: 2,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          />
          <Typography variant="h5" fontWeight={600}>{profile.name}</Typography>
          {profile.user?.username && (
            <Typography variant="subtitle2" color="text.secondary">@{profile.user.username}</Typography>
          )}
          {profile.user?.bio && (
            <Typography variant="body2" mt={1}>{profile.user.bio}</Typography>
          )}
          {profile.website && (
            <MuiLink
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
              sx={{ display: 'inline-flex', alignItems: 'center', mt: 1 }}
            >
              <Globe size={18} style={{ marginRight: 6 }} /> {profile.website.replace(/^https?:\/\//, '')}
            </MuiLink>
          )}
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 'auto',
          }}
          TabIndicatorProps={{
            sx: {
              height: 3,
            },
          }}
        >
          <Tab
            value="articles"
            label="Articles"
            sx={{ fontWeight: tab === 'articles' ? 700 : 400, minHeight: 'auto' }}
          />
          <Tab
            value="contracts"
            label="Contracts"
            sx={{ fontWeight: tab === 'contracts' ? 700 : 400, minHeight: 'auto' }}
          />
        </Tabs>
      </Box>




      {/* Tab Content */}
      {tab === 'articles' && (
        articles.length > 0 ? (
          <Grid container spacing={4}>
            {articles.map(article => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/readers/articles/${article.code}`)}
                >
                  <img
                    src={article.cover_picture}
                    alt={article.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {article.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="textSecondary"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </CardContent>
                  <Author
                    authors={[article.author]}
                    created_at={article.created_at}
                    company={{
                      name: article.author.lawfirm.name,
                      logo: article.author.lawfirm.user?.profile_picture,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">No articles found.</Typography>
        )
      )}

      {tab === 'contracts' && (
        contracts.length > 0 ? (
          <Grid container spacing={4}>
            {contracts.map(contract => (
              <Grid item xs={12} sm={6} md={4} key={contract.id}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/readers/contracts/${contract.code}`)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{contract.name}</Typography>
                    <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {contract.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">No contracts found.</Typography>
        )
      )}
    </Container>
  );
};

export default LawFirmContentPage;