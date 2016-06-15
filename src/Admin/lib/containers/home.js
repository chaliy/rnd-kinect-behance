import { Link } from 'react-router';

export default () => {
    return (
        <div>
          <h2>Admin</h2>
          <ul>
            <li><Link to={`/stats`}>Stats</Link></li>
          </ul>
        </div>
    )
}
