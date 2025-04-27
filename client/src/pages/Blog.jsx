import React from 'react'
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material'

const blogPosts = [
  {
    id: 1,
    title: "What are the documents needed to purchase a property?",
    excerpt: "Learn about the essential documents required for property purchase, including title deeds, sale agreements, and more.",
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "Understanding Property Taxes: A Complete Guide",
    excerpt: "Everything you need to know about property taxes, including calculation methods and payment procedures.",
    date: "March 10, 2024"
  },
  {
    id: 3,
    title: "Home Loan Process: Step by Step Guide",
    excerpt: "A comprehensive guide to understanding the home loan application process and requirements.",
    date: "March 5, 2024"
  },
  {
    id: 4,
    title: "Real Estate Investment: Tips for Beginners",
    excerpt: "Essential tips and strategies for those looking to start their real estate investment journey.",
    date: "March 1, 2024"
  }
]

export default function Blog() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: { xs: 12, md: 16 } }}>
      <h6 className='text-6xl mb-10'>Blog</h6>
      
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  {post.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                >
                  {post.date}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {post.excerpt}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    variant="button" 
                    color="primary" 
                    sx={{ 
                      cursor: 'pointer',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Read More →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
