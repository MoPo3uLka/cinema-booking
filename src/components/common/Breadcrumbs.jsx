import { Link } from 'react-router-dom'

function Breadcrumbs({ steps = [] }) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <Link to="/">Главная</Link>
      {steps.map((step, i) => (
        <span key={i}>
          <span className="breadcrumb-separator"> / </span>
          <span>{step}</span>
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs