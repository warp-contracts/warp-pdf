import { Table } from 'solid-bootstrap';
import { ParentComponent } from 'solid-js';
import './List.scss';
import { overflowId } from '../utils';

interface ListProps {
  data: any[];
}

const List: ParentComponent<ListProps> = (props) => {
  return (
    <Table responsive class='list'>
      <thead>
        <tr>
          <th></th>
          <th class='list__header--left'>Id</th>
          <th class='list__header--left'>Name</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody class='align-middle'>
        {props.data &&
          props.data.map((d) => (
            <tr>
              <td>{d.i}</td>
              <td class='list__row--left'>
                <a
                  href={`https://sonar.warp.cc/#/app/contract/${d.id}?network=mainnet#`}
                  class='list__link'
                  target='__blank'
                >
                  {overflowId(d.id)}
                </a>
              </td>
              <td class='list__row--left'>{d.name && overflowId(d.name)}</td>
              <td>
                <a href={`https://arweave.net/${d.id}`} class='list__link' target='__blank'>
                  <img src='/assets/pdf.svg' height={20} />
                </a>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default List;
