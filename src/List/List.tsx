import { Table } from 'solid-bootstrap';
import { ParentComponent } from 'solid-js';
import './List.scss';
import { overflowId } from '../utils';

interface ListProps {
  data: any[];
}

const List: ParentComponent<ListProps> = (props) => {
  return (
    <>
      <Table responsive class='list'>
        <thead>
          <tr>
            <th></th>
            <th class='list__header--left'>Name</th>
            <th class='list__header--left'>Submitted</th>
            <th class='list__header--right'>Transaction Id</th>
          </tr>
        </thead>
        <tbody class='align-middle'>
          {props.data &&
            props.data.map((d) => (
              <tr>
                <td>{d.i}</td>
                <td class='list__row--left' data-toggle='tooltip' data-placement='top' title={d.name}>
                  <a href={`https://arweave.net/${d.id}`} class='list__link' target='__blank'>
                    {d.name && overflowId(d.name, 20)}
                  </a>
                </td>
                <td class='list__row--left'>
                  {new Date(Number(d.timestamp)).toLocaleDateString()}{' '}
                  {new Date(Number(d.timestamp)).toLocaleTimeString()}
                </td>
                <td class='list__row--right'>
                  <a
                    href={`https://sonar.warp.cc/#/app/contract/${d.id}?network=mainnet`}
                    class='list__link'
                    target='__blank'
                  >
                    {overflowId(d.id, 4)}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div class='list__more'>
        Maximum 100 documents are displayed. See all{' '}
        <a
          href='https://sonar.warp.cc/#/app/source/HzBCFeoei50hjdlEq2X0q0X5qdMHNozXaCkNZfHRI1M?network=mainnet'
          target='__blank'
        >
          here
        </a>
        .
      </div>
    </>
  );
};

export default List;
