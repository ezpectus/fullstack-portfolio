"""Notification channel CRUD routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from web.auth.routes import CurrentUser
from web.db.models import NotificationChannelModel, ProjectModel
from web.db.session import get_session


router = APIRouter(prefix="/api/notifications", tags=["notifications"])


class ChannelCreate(BaseModel):
    name: str
    channel_type: str  # "telegram" | "discord"
    webhook_url: str
    notify_on_success: bool = False
    notify_on_failure: bool = True
    project_id: int | None = None


class ChannelResponse(BaseModel):
    id: int
    name: str
    channel_type: str
    is_active: bool
    notify_on_success: bool
    notify_on_failure: bool
    project_id: int | None = None


@router.get("", response_model=list[ChannelResponse])
async def list_channels(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    result = await db.execute(
        select(NotificationChannelModel)
        .outerjoin(ProjectModel, NotificationChannelModel.project_id == ProjectModel.id)
        .where(
            (ProjectModel.owner_id == int(user["user_id"])) |
            (NotificationChannelModel.project_id.is_(None))
        )
    )
    channels = result.scalars().all()
    return [
        ChannelResponse(
            id=c.id,
            name=c.name,
            channel_type=c.channel_type,
            is_active=c.is_active,
            notify_on_success=c.notify_on_success,
            notify_on_failure=c.notify_on_failure,
            project_id=c.project_id,
        )
        for c in channels
    ]


@router.post("", response_model=ChannelResponse)
async def create_channel(
    req: ChannelCreate,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    ch = NotificationChannelModel(
        name=req.name,
        channel_type=req.channel_type,
        webhook_url=req.webhook_url,
        notify_on_success=req.notify_on_success,
        notify_on_failure=req.notify_on_failure,
        project_id=req.project_id,
    )
    db.add(ch)
    await db.flush()
    return ChannelResponse(
        id=ch.id,
        name=ch.name,
        channel_type=ch.channel_type,
        is_active=ch.is_active,
        notify_on_success=ch.notify_on_success,
        notify_on_failure=ch.notify_on_failure,
        project_id=ch.project_id,
    )


@router.delete("/{channel_id}")
async def delete_channel(
    channel_id: int,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_session)],
):
    result = await db.execute(
        select(NotificationChannelModel)
        .outerjoin(ProjectModel, NotificationChannelModel.project_id == ProjectModel.id)
        .where(
            NotificationChannelModel.id == channel_id,
            (ProjectModel.owner_id == int(user["user_id"])) | (NotificationChannelModel.project_id.is_(None))
        )
    )
    ch = result.scalar_one_or_none()
    if not ch:
        raise HTTPException(404, "Channel not found")
    await db.delete(ch)
    return {"status": "deleted"}
