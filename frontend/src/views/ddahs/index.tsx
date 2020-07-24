import React from "react";
import { ConnectedAddDdahDialog } from "./add-ddah-dialog";
import { FaPlus, FaMailBulk, FaCheck } from "react-icons/fa";
import {
    ConnectedImportDdahsAction,
    ConnectedExportDdahsAction,
    ConnectedDownloadPositionDdahTemplatesAction,
} from "./import-export";
import {
    ActionsList,
    ActionButton,
    ActionHeader,
} from "../../components/action-buttons";
import { ContentArea } from "../../components/layout";
import { ConnectedDdahsTable } from "../ddah-table";
import { MissingActiveSessionWarning } from "../../components/sessions";
import { useSelector, useDispatch } from "react-redux";
import { activeSessionSelector } from "../../api/actions";
import { ddahTableSelector } from "../ddah-table/actions";
import { ddahsSelector, emailDdah, approveDdah } from "../../api/actions/ddahs";
import { Ddah } from "../../api/defs/types";

export function AdminDdahsView(): React.ReactNode {
    const [addDialogVisible, setAddDialogVisible] = React.useState(false);
    const activeSession = useSelector(activeSessionSelector);
    const { selectedDdahIds } = useSelector(ddahTableSelector);
    const ddahs = useSelector<any, Ddah[]>(ddahsSelector);
    const dispatch = useDispatch();
    const selectedDdahs = ddahs.filter((ddah) =>
        selectedDdahIds.includes(ddah.id)
    );

    return (
        <div className="page-body">
            <ActionsList>
                <ActionHeader>Available Actions</ActionHeader>
                <ActionButton
                    icon={<FaPlus />}
                    onClick={() => {
                        setAddDialogVisible(true);
                    }}
                >
                    Add DDAH
                </ActionButton>
                <ConnectedDownloadPositionDdahTemplatesAction />

                <ActionHeader>Import/Export</ActionHeader>
                <ConnectedImportDdahsAction />
                <ConnectedExportDdahsAction />
                <ActionHeader>Selected DDAH Actions</ActionHeader>
                <ActionButton
                    icon={FaMailBulk}
                    onClick={() => {
                        for (const ddah of selectedDdahs) {
                            dispatch(emailDdah(ddah));
                        }
                    }}
                >
                    Email DDAH
                </ActionButton>
                <ActionButton
                    icon={FaCheck}
                    onClick={() => {
                        for (const ddah of selectedDdahs) {
                            dispatch(approveDdah(ddah));
                        }
                    }}
                >
                    Approve DDAH
                </ActionButton>
            </ActionsList>
            <ContentArea>
                {activeSession ? null : (
                    <MissingActiveSessionWarning extraText="To view or modify DDAHs, you must select a session." />
                )}
                <ConnectedAddDdahDialog
                    show={addDialogVisible}
                    onHide={() => {
                        setAddDialogVisible(false);
                    }}
                />
                <ConnectedDdahsTable />
            </ContentArea>
        </div>
    );
}
