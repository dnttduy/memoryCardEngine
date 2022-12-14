import { LoadingButton } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllStage = ({ status }) => {
  const [stages, setStages] = useState();
  const { actor } = useSelector(state => state.user);
  async function memoryCardEngineAllStages() {
    try {
      const rs = await actor.memoryCardEngineAllStages();
      if ("ok" in rs) {
        setStages(rs.ok);
      } else {
        throw rs.err;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    memoryCardEngineAllStages();
  }, [status]);
  const handleClick = (id, setLoading) => {
    (async () => {
      try {
        setLoading(true);
        const rs = await actor.memoryCardEngineStageDelete(id);
        if ("ok" in rs) {
          memoryCardEngineAllStages();
        } else {
          throw rs.err;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  };
  return (
    <>
      {stages?.length > 0 && (
        <div style={{ width: "100%", marginTop: 20 }}>
          <DataGrid
            getRowId={row => row.stageId}
            autoHeight
            pagination
            disableSelectionOnClick
            disableColumnMenu
            pageSize={10}
            rowsPerPageOptions={[10]}
            rows={stages.map(stage => ({ ...stage[1], stageId: stage[0] }))}
            columns={[
              {
                field: "stageId",
                headerName: "Id",
                flex: 1
              },
              ...Object.keys(stages?.[0]?.[1]).map(key => ({
                field: key,
                headerName: key,
                flex: ["name", "gameId"].includes(key) ? 1 : 0
              })),
              {
                field: "delete",
                headerName: "delete",
                renderCell: props => <ButtonStatus {...props} handleClick={handleClick} />
              }
            ]}
          />
        </div>
      )}
    </>
  );
};
const ButtonStatus = props => {
  const [loading, setLoading] = useState(false);
  console.log(props);
  return (
    <LoadingButton
      loading={loading}
      variant="outlined"
      onClick={() => props.handleClick(props.id, setLoading)}>
      Delete
    </LoadingButton>
  );
};
export default AllStage;
