import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import PlateEditor, { emptyDocument } from '../../components/PlateEditor';
import './instructor.css';

export default function ChapterForm() {
  const { courseId, chapterId } = useParams();
  const isEditing = Boolean(chapterId);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    visibility: 'private',
    order_index: 0,
  });
  const [content, setContent] = useState(emptyDocument);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      api.get(`/chapters/${chapterId}/`)
        .then(res => {
          setForm({
            title: res.data.title,
            visibility: res.data.visibility,
            order_index: res.data.order_index,
          });
          if (res.data.content && res.data.content.length > 0) {
            setContent(res.data.content);
          }
        })
        .catch(() => setError('Could not load chapter'));
    }
  }, [chapterId, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = { ...form, content };

    try {
      if (isEditing) {
        await api.put(`/chapters/${chapterId}/`, payload);
        navigate(`/instructor/courses/${courseId || getCourseIdFromBack()}`);
      } else {
        await api.post(`/courses/${courseId}/chapters/create/`, payload);
        navigate(`/instructor/courses/${courseId}`);
      }
    } catch (err) {
      setError('Failed to save chapter.');
    } finally {
      setLoading(false);
    }
  };

  // If editing, we need courseId from the chapter data or URL
  const getCourseIdFromBack = () => {
    return 'back'; // fallback: use navigate(-1)
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEditing ? 'Edit Chapter' : 'New Chapter'}</h1>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Chapter Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Variables"
                required
              />
            </div>

            <div className="form-group">
              <label>Visibility</label>
              <select name="visibility" value={form.visibility} onChange={handleChange}>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="form-group" style={{ width: '100px' }}>
              <label>Order</label>
              <input
                type="number"
                name="order_index"
                value={form.order_index}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <p className="form-hint">
              Use the toolbar to format your content. Supports headings, bold, italic, lists, and more.
            </p>
            <PlateEditor
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Chapter'}
          </button>
        </div>
      </form>
    </div>
  );
}
