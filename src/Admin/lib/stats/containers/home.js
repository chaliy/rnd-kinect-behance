import { wire } from '../../utils/wires';
import { load } from '../../utils/api';

import { Doughnut } from 'react-chartjs';

const UI = ({ stats }) => (
    <div>
      <table className="table table-striped">
        <thead>
          <tr><th>Проект</th><th>Оцінки</th></tr>
        </thead>
        <tbody>
        { stats.map(item => (
          <tr key={item.projectId}><td>{item.projectId}</td><td>{item.likesCount}</td></tr>
        ))}
        </tbody>
      </table>
      <h2>Розподіл оцінок</h2>
      <Doughnut data={ stats.map(item => ({
        value: item.likesCount,
        label: item.projectId
      })) } />
    </div>
);

const mount = async () => ({
  stats:  await load('api/stats.json')
});

const state = {
  stats: []
};

export default wire({ mount, state })(UI);
