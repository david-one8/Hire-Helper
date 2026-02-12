import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';

const RequestCard = ({ request, onAccept, onDecline }) => {
  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Avatar
            src={request.requester?.avatar}
            alt={request.requester?.name}
            size="lg"
            fallback={request.requester?.name?.[0]}
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">
                {request.requester?.name}
              </h3>
              {request.requester?.rating && (
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-medium">{request.requester.rating}</span>
                  {request.requester?.reviews && (
                    <span className="text-gray-400">
                      ({request.requester.reviews})
                    </span>
                  )}
                </div>
              )}
            </div>

            {request.task && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Requesting for:
                </p>
                <p className="font-medium text-primary-600 dark:text-primary-400">
                  {request.task}
                </p>
              </div>
            )}

            {request.message && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Message:
                </p>
                <p className="text-sm">{request.message}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {request.requestedAt && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {request.requestedAt}
                </div>
              )}
              {request.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {request.location}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col gap-3 md:min-w-[120px]">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => onAccept?.(request)}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onDecline?.(request)}
          >
            Decline
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RequestCard;
