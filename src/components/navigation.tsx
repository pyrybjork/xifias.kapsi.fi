import { Link } from 'react-router-dom';

const Navigation: React.FunctionComponent = () => {
    return ( <nav className="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/test">Test</Link>
          </li>
        </ul>
      </nav>
    )};

export default Navigation;