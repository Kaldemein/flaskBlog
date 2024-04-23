import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function ArticleList({ articles, editArticle }) {
  return (
    <Box display="flex" flexDirection="column">
      {articles.map((article) => {
        return (
          <Card sx={{ width: 800, marginTop: 2 }}>
            <CardMedia
              // sx={{ height: 80 }}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {article.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {article.datetime.slice(0, 10)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {article.body}
              </Typography>
            </CardContent>
            <Box display="flex" justifyContent="right">
              <Box
                display="flex"
                justifyContent="space-between"
                px={{ margin: 10, width: 210 }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => editArticle(article)}
                  variant="contained"
                  endIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
