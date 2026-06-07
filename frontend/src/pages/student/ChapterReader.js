import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';
import PlateEditor from '../../components/PlateEditor';
import './student.css';

export default function ChapterReader() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/chapters/${chapterId}/`)
      .then(res => setChapter(res.data))
      .catch(err => {
        if (err.response?.status === 403) {
          setError('This chapter is private or you have not joined the course yet.');
        } else {
          setError('Could not load chapter.');
        }
      })
      .finally(() => setLoading(false));
  }, [chapterId]);

  if (loading) return <div className="page-container"><p>Loading chapter...</p></div>;

  if (error) {
    return (
      <div className="page-container">
        <div className="error-msg">{error}</div>
        <Link to="/student/my-courses" className="btn-outline">Back to my courses</Link>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <div className="reader-header">
        <Link to="/student/my-courses" className="back-link">← Back</Link>
        <h1>{chapter.title}</h1>
      </div>

      <div className="reader-content">
        {chapter.content && chapter.content.length > 0 ? (
          <PlateEditor value={chapter.content} readOnly={true} />
        ) : (
          <p className="text-muted">This chapter has no content yet.</p>
        )}
      </div>
    </div>
  );
}
